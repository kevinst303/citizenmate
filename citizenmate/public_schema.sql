


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."auto_generate_blog_slug"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        base_slug := generate_slug(NEW.title);
        final_slug := base_slug;
        
        WHILE EXISTS (
            SELECT 1 FROM blog_translations 
            WHERE locale = NEW.locale AND slug = final_slug 
            AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
        ) LOOP
            counter := counter + 1;
            final_slug := base_slug || '-' || counter;
        END LOOP;
        
        NEW.slug := final_slug;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."auto_generate_blog_slug"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."auto_generate_product_slug"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Only generate if slug is NULL or empty
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        base_slug := generate_slug(NEW.name);
        final_slug := base_slug;
        
        -- Handle uniqueness by appending counter if needed
        WHILE EXISTS (
            SELECT 1 FROM product_translations 
            WHERE locale = NEW.locale AND slug = final_slug 
            AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
        ) LOOP
            counter := counter + 1;
            final_slug := base_slug || '-' || counter;
        END LOOP;
        
        NEW.slug := final_slug;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."auto_generate_product_slug"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_slug"("title" "text") RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    result TEXT;
BEGIN
    -- Convert to lowercase
    result := LOWER(title);
    
    -- Vietnamese character transliteration
    result := TRANSLATE(result,
        'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ',
        'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'
    );
    
    -- Replace spaces and special chars with hyphens
    result := REGEXP_REPLACE(result, '[^a-z0-9가-힣\-]', '-', 'g');
    
    -- Remove consecutive hyphens
    result := REGEXP_REPLACE(result, '-+', '-', 'g');
    
    -- Trim hyphens from start and end
    result := TRIM(BOTH '-' FROM result);
    
    RETURN result;
END;
$$;


ALTER FUNCTION "public"."generate_slug"("title" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_pages"("p_locale" character varying) RETURNS json
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
BEGIN
    RETURN (
        SELECT json_agg(
            json_build_object(
                'id', id,
                'slug', slug,
                'page_type', page_type,
                'title', title,
                'seo_title', seo_title
            ) ORDER BY page_type, title
        )
        FROM page_definitions
        WHERE locale = p_locale
        AND is_published = TRUE
    );
END;
$$;


ALTER FUNCTION "public"."get_all_pages"("p_locale" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_blog_post_by_slug"("p_locale" character varying, "p_slug" character varying) RETURNS json
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'id', bp.id,
        'published_at', bp.published_at,
        'is_featured', bp.is_featured,
        'reading_time', bp.reading_time,
        'translation', json_build_object(
            'title', bt.title,
            'slug', bt.slug,
            'excerpt', bt.excerpt,
            'content', bt.content,
            'seo_title', bt.seo_title,
            'seo_description', bt.seo_description,
            'seo_keywords', bt.seo_keywords,
            'og_image_url', bt.og_image_url
        ),
        'media', (
            SELECT json_agg(
                json_build_object(
                    'id', bm.id,
                    'url', bm.url,
                    'alt_text', bm.alt_text,
                    'type', bm.type,
                    'is_featured', bm.is_featured,
                    'caption', bm.caption
                ) ORDER BY bm.is_featured DESC, bm.sort_order ASC
            )
            FROM blog_media bm
            WHERE bm.blog_post_id = bp.id
        ),
        'alternate_slugs', (
            SELECT json_object_agg(
                alt.locale,
                alt.slug
            )
            FROM blog_translations alt
            WHERE alt.blog_post_id = bp.id
        )
    ) INTO result
    FROM blog_posts bp
    INNER JOIN blog_translations bt ON bt.blog_post_id = bp.id AND bt.locale = p_locale
    WHERE bt.slug = p_slug
    AND bp.status = 'published'
    AND bp.published_at <= NOW();
    
    RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_blog_post_by_slug"("p_locale" character varying, "p_slug" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_navigation"("p_locale" character varying, "p_nav_group" character varying DEFAULT 'main'::character varying) RETURNS json
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
DECLARE
    result JSON;
BEGIN
    WITH RECURSIVE nav_tree AS (
        -- Root level items (no parent)
        SELECT 
            id, parent_id, label, href, target, icon, 
            position, highlight, badge_text,
            0 as depth
        FROM navigation_items
        WHERE locale = p_locale
        AND nav_group = p_nav_group
        AND parent_id IS NULL
        AND is_enabled = TRUE
        
        UNION ALL
        
        -- Child items
        SELECT 
            ni.id, ni.parent_id, ni.label, ni.href, ni.target, ni.icon,
            ni.position, ni.highlight, ni.badge_text,
            nt.depth + 1
        FROM navigation_items ni
        INNER JOIN nav_tree nt ON ni.parent_id = nt.id
        WHERE ni.is_enabled = TRUE
    )
    SELECT json_agg(
        json_build_object(
            'id', id,
            'label', label,
            'href', href,
            'target', target,
            'icon', icon,
            'highlight', highlight,
            'badge_text', badge_text,
            'children', (
                SELECT json_agg(
                    json_build_object(
                        'id', c.id,
                        'label', c.label,
                        'href', c.href,
                        'target', c.target,
                        'icon', c.icon,
                        'highlight', c.highlight,
                        'badge_text', c.badge_text
                    ) ORDER BY c.position
                )
                FROM nav_tree c
                WHERE c.parent_id = nav_tree.id
            )
        ) ORDER BY position
    ) INTO result
    FROM nav_tree
    WHERE parent_id IS NULL;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$;


ALTER FUNCTION "public"."get_navigation"("p_locale" character varying, "p_nav_group" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_page_content"("p_locale" character varying, "p_slug" character varying) RETURNS json
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'page', json_build_object(
            'id', pd.id,
            'slug', pd.slug,
            'page_type', pd.page_type,
            'title', pd.title,
            'seo', json_build_object(
                'title', pd.seo_title,
                'description', pd.seo_description,
                'og_image_url', pd.seo_og_image_url,
                'keywords', pd.seo_keywords
            ),
            'is_published', pd.is_published,
            'published_at', pd.published_at
        ),
        'sections', COALESCE(
            (SELECT json_agg(
                json_build_object(
                    'id', ps.id,
                    'section_type', ps.section_type,
                    'section_key', ps.section_key,
                    'position', ps.position,
                    'config', ps.config_json
                ) ORDER BY ps.position ASC
            )
            FROM page_sections ps
            WHERE ps.page_id = pd.id
            AND ps.is_enabled = TRUE),
            '[]'::json
        ),
        'alternate_pages', (
            SELECT json_object_agg(
                alt.locale,
                json_build_object('slug', alt.slug, 'title', alt.title)
            )
            FROM page_definitions alt
            WHERE alt.slug = pd.slug
            AND alt.is_published = TRUE
        )
    ) INTO result
    FROM page_definitions pd
    WHERE pd.locale = p_locale
    AND pd.slug = p_slug
    AND pd.is_published = TRUE;
    
    RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_page_content"("p_locale" character varying, "p_slug" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_product_by_slug"("p_locale" character varying, "p_slug" character varying) RETURNS json
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'id', p.id,
        'sku', p.sku,
        'is_featured', p.is_featured,
        'is_new', p.is_new,
        'category', (
            SELECT json_build_object(
                'id', pc.id,
                'slug', pc.slug,
                'name', pct.name
            )
            FROM product_categories pc
            LEFT JOIN product_category_translations pct ON pct.category_id = pc.id AND pct.locale = p_locale
            WHERE pc.id = p.category_id
        ),
        'translation', json_build_object(
            'name', pt.name,
            'slug', pt.slug,
            'short_description', pt.short_description,
            'description', pt.description,
            'ingredients', pt.ingredients,
            'how_to_use', pt.how_to_use,
            'price', pt.price,
            'compare_price', pt.compare_price,
            'currency', pt.currency,
            'seo_title', pt.seo_title,
            'seo_description', pt.seo_description,
            'seo_keywords', pt.seo_keywords,
            'og_image_url', pt.og_image_url
        ),
        'media', (
            SELECT json_agg(
                json_build_object(
                    'id', pm.id,
                    'url', pm.url,
                    'alt_text', pm.alt_text,
                    'type', pm.type,
                    'is_primary', pm.is_primary,
                    'sort_order', pm.sort_order
                ) ORDER BY pm.is_primary DESC, pm.sort_order ASC
            )
            FROM product_media pm
            WHERE pm.product_id = p.id
        ),
        'external_links', (
            SELECT json_agg(
                json_build_object(
                    'id', pel.id,
                    'platform', pel.platform,
                    'url', pel.url,
                    'label', pel.label
                ) ORDER BY pel.sort_order
            )
            FROM product_external_links pel
            WHERE pel.product_id = p.id
            AND pel.is_active = TRUE
            AND (pel.locale IS NULL OR pel.locale = p_locale)
        ),
        'alternate_slugs', (
            SELECT json_object_agg(
                alt.locale,
                alt.slug
            )
            FROM product_translations alt
            WHERE alt.product_id = p.id
        )
    ) INTO result
    FROM products p
    INNER JOIN product_translations pt ON pt.product_id = p.id AND pt.locale = p_locale
    WHERE pt.slug = p_slug
    AND p.is_active = TRUE;
    
    RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_product_by_slug"("p_locale" character varying, "p_slug" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR
        auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_site_settings_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_site_settings_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."blog_media" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "blog_post_id" "uuid" NOT NULL,
    "url" "text" NOT NULL,
    "alt_text" character varying(200),
    "type" character varying(20) DEFAULT 'image'::character varying,
    "is_featured" boolean DEFAULT false,
    "sort_order" integer DEFAULT 0,
    "caption" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."blog_media" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."blog_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "author_id" "uuid",
    "status" character varying(20) DEFAULT 'draft'::character varying,
    "published_at" timestamp with time zone,
    "is_featured" boolean DEFAULT false,
    "reading_time" integer,
    "sort_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."blog_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."blog_translations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "blog_post_id" "uuid" NOT NULL,
    "locale" character varying(5) NOT NULL,
    "title" character varying(200) NOT NULL,
    "slug" character varying(200) NOT NULL,
    "excerpt" "text",
    "content" "text",
    "seo_title" character varying(70),
    "seo_description" character varying(160),
    "seo_keywords" "text",
    "og_image_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."blog_translations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."locales" (
    "code" character varying(5) NOT NULL,
    "name" character varying(50) NOT NULL,
    "native_name" character varying(50) NOT NULL,
    "is_default" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."locales" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."media_assets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "filename" character varying(255) NOT NULL,
    "mime_type" character varying(100) NOT NULL,
    "size_bytes" integer,
    "width" integer,
    "height" integer,
    "bunny_path" "text" NOT NULL,
    "bunny_cdn_url" "text" NOT NULL,
    "folder_id" "uuid",
    "alt_text" character varying(255),
    "credits" character varying(255),
    "uploaded_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."media_assets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."media_folders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "parent_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."media_folders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."navigation_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "locale" character varying(5) NOT NULL,
    "nav_group" character varying(50) DEFAULT 'main'::character varying NOT NULL,
    "parent_id" "uuid",
    "label" character varying(100) NOT NULL,
    "href" character varying(200) NOT NULL,
    "target" character varying(20) DEFAULT '_self'::character varying,
    "icon" character varying(50),
    "position" integer DEFAULT 0,
    "is_enabled" boolean DEFAULT true,
    "highlight" boolean DEFAULT false,
    "badge_text" character varying(20),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."navigation_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."page_definitions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" character varying(200) NOT NULL,
    "route_pattern" character varying(200),
    "locale" character varying(5) NOT NULL,
    "page_type" character varying(50) NOT NULL,
    "title" character varying(200) NOT NULL,
    "seo_title" character varying(70),
    "seo_description" character varying(160),
    "seo_og_image_url" "text",
    "seo_keywords" "text",
    "is_published" boolean DEFAULT false,
    "published_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."page_definitions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."page_sections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "page_id" "uuid" NOT NULL,
    "section_type" character varying(50) NOT NULL,
    "section_key" character varying(100),
    "position" integer DEFAULT 0 NOT NULL,
    "is_enabled" boolean DEFAULT true,
    "config_json" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."page_sections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" character varying(100) NOT NULL,
    "parent_id" "uuid",
    "sort_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."product_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_category_translations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" "uuid" NOT NULL,
    "locale" character varying(5) NOT NULL,
    "name" character varying(200) NOT NULL,
    "description" "text",
    "seo_title" character varying(70),
    "seo_description" character varying(160)
);


ALTER TABLE "public"."product_category_translations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_external_links" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid" NOT NULL,
    "platform" character varying(50) NOT NULL,
    "url" "text" NOT NULL,
    "label" character varying(100),
    "locale" character varying(5),
    "is_active" boolean DEFAULT true,
    "sort_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "icon" character varying(50),
    "color" character varying(50),
    "hover_color" character varying(50)
);


ALTER TABLE "public"."product_external_links" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_feedback_translations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "feedback_id" "uuid" NOT NULL,
    "locale" character varying(5) NOT NULL,
    "title" character varying(200),
    "body" "text" NOT NULL,
    "context" character varying(200),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."product_feedback_translations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_feedbacks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid" NOT NULL,
    "image_url" "text",
    "author_name" character varying(100),
    "author_context" character varying(200),
    "sort_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."product_feedbacks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_media" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid" NOT NULL,
    "url" "text" NOT NULL,
    "alt_text" character varying(200),
    "type" character varying(20) DEFAULT 'image'::character varying,
    "is_primary" boolean DEFAULT false,
    "sort_order" integer DEFAULT 0,
    "width" integer,
    "height" integer,
    "file_size" integer,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."product_media" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_translations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid" NOT NULL,
    "locale" character varying(5) NOT NULL,
    "name" character varying(200) NOT NULL,
    "slug" character varying(200) NOT NULL,
    "short_description" "text",
    "description" "text",
    "ingredients" "text",
    "how_to_use" "text",
    "price" numeric(12,2),
    "compare_price" numeric(12,2),
    "currency" character varying(3) DEFAULT 'VND'::character varying,
    "seo_title" character varying(70),
    "seo_description" character varying(160),
    "seo_keywords" "text",
    "og_image_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."product_translations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" "uuid",
    "sku" character varying(50),
    "is_featured" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "is_new" boolean DEFAULT false,
    "sort_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."redirects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "from_path" character varying(200) NOT NULL,
    "to_url" "text" NOT NULL,
    "status_code" integer DEFAULT 301,
    "is_enabled" boolean DEFAULT true,
    "site" character varying(50),
    "locale" character varying(5),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."redirects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."site_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "setting_key" "text" NOT NULL,
    "value" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "description" "text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid"
);


ALTER TABLE "public"."site_settings" OWNER TO "postgres";


COMMENT ON TABLE "public"."site_settings" IS 'Site-wide configuration settings stored as key-value pairs with JSONB values';



COMMENT ON COLUMN "public"."site_settings"."setting_key" IS 'Unique identifier for the setting (e.g., socials, floating_actions)';



COMMENT ON COLUMN "public"."site_settings"."value" IS 'JSON value containing the setting data';



CREATE TABLE IF NOT EXISTS "public"."static_page_slots" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "page_id" "uuid",
    "locale" "text" NOT NULL,
    "slot_key" "text" NOT NULL,
    "content_value" "text",
    "rich_content" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."static_page_slots" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."static_page_translations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "page_id" "uuid",
    "locale" "text" NOT NULL,
    "seo_title" "text",
    "seo_description" "text",
    "seo_og_image_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."static_page_translations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."static_pages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."static_pages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tiktok_videos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "url" "text" NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "is_enabled" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tiktok_videos" OWNER TO "postgres";


ALTER TABLE ONLY "public"."blog_media"
    ADD CONSTRAINT "blog_media_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_translations"
    ADD CONSTRAINT "blog_translations_blog_post_id_locale_key" UNIQUE ("blog_post_id", "locale");



ALTER TABLE ONLY "public"."blog_translations"
    ADD CONSTRAINT "blog_translations_locale_slug_key" UNIQUE ("locale", "slug");



ALTER TABLE ONLY "public"."blog_translations"
    ADD CONSTRAINT "blog_translations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."locales"
    ADD CONSTRAINT "locales_pkey" PRIMARY KEY ("code");



ALTER TABLE ONLY "public"."media_assets"
    ADD CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."media_folders"
    ADD CONSTRAINT "media_folders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."navigation_items"
    ADD CONSTRAINT "navigation_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."page_definitions"
    ADD CONSTRAINT "page_definitions_locale_slug_key" UNIQUE ("locale", "slug");



ALTER TABLE ONLY "public"."page_definitions"
    ADD CONSTRAINT "page_definitions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."page_sections"
    ADD CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_categories"
    ADD CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_categories"
    ADD CONSTRAINT "product_categories_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."product_category_translations"
    ADD CONSTRAINT "product_category_translations_category_id_locale_key" UNIQUE ("category_id", "locale");



ALTER TABLE ONLY "public"."product_category_translations"
    ADD CONSTRAINT "product_category_translations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_external_links"
    ADD CONSTRAINT "product_external_links_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_feedback_translations"
    ADD CONSTRAINT "product_feedback_translations_feedback_id_locale_key" UNIQUE ("feedback_id", "locale");



ALTER TABLE ONLY "public"."product_feedback_translations"
    ADD CONSTRAINT "product_feedback_translations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_feedbacks"
    ADD CONSTRAINT "product_feedbacks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_media"
    ADD CONSTRAINT "product_media_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_translations"
    ADD CONSTRAINT "product_translations_locale_slug_key" UNIQUE ("locale", "slug");



ALTER TABLE ONLY "public"."product_translations"
    ADD CONSTRAINT "product_translations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_translations"
    ADD CONSTRAINT "product_translations_product_id_locale_key" UNIQUE ("product_id", "locale");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_sku_key" UNIQUE ("sku");



ALTER TABLE ONLY "public"."redirects"
    ADD CONSTRAINT "redirects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."site_settings"
    ADD CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."site_settings"
    ADD CONSTRAINT "site_settings_setting_key_key" UNIQUE ("setting_key");



ALTER TABLE ONLY "public"."static_page_slots"
    ADD CONSTRAINT "static_page_slots_page_id_locale_slot_key_key" UNIQUE ("page_id", "locale", "slot_key");



ALTER TABLE ONLY "public"."static_page_slots"
    ADD CONSTRAINT "static_page_slots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."static_page_translations"
    ADD CONSTRAINT "static_page_translations_page_id_locale_key" UNIQUE ("page_id", "locale");



ALTER TABLE ONLY "public"."static_page_translations"
    ADD CONSTRAINT "static_page_translations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."static_pages"
    ADD CONSTRAINT "static_pages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."static_pages"
    ADD CONSTRAINT "static_pages_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."tiktok_videos"
    ADD CONSTRAINT "tiktok_videos_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_blog_media_featured" ON "public"."blog_media" USING "btree" ("blog_post_id", "is_featured") WHERE ("is_featured" = true);



CREATE INDEX "idx_blog_media_post" ON "public"."blog_media" USING "btree" ("blog_post_id");



CREATE INDEX "idx_blog_posts_author" ON "public"."blog_posts" USING "btree" ("author_id");



CREATE INDEX "idx_blog_posts_featured" ON "public"."blog_posts" USING "btree" ("is_featured") WHERE ("is_featured" = true);



CREATE INDEX "idx_blog_posts_published" ON "public"."blog_posts" USING "btree" ("published_at" DESC) WHERE (("status")::"text" = 'published'::"text");



CREATE INDEX "idx_blog_posts_status" ON "public"."blog_posts" USING "btree" ("status");



CREATE INDEX "idx_blog_trans_locale" ON "public"."blog_translations" USING "btree" ("locale");



CREATE INDEX "idx_blog_trans_post" ON "public"."blog_translations" USING "btree" ("blog_post_id");



CREATE INDEX "idx_blog_trans_slug" ON "public"."blog_translations" USING "btree" ("locale", "slug");



CREATE INDEX "idx_external_links_active" ON "public"."product_external_links" USING "btree" ("product_id", "is_active") WHERE ("is_active" = true);



CREATE INDEX "idx_external_links_platform" ON "public"."product_external_links" USING "btree" ("platform");



CREATE INDEX "idx_external_links_product" ON "public"."product_external_links" USING "btree" ("product_id");



CREATE INDEX "idx_media_assets_folder" ON "public"."media_assets" USING "btree" ("folder_id");



CREATE INDEX "idx_media_assets_mime" ON "public"."media_assets" USING "btree" ("mime_type");



CREATE INDEX "idx_media_assets_uploaded_by" ON "public"."media_assets" USING "btree" ("uploaded_by");



CREATE INDEX "idx_navigation_enabled" ON "public"."navigation_items" USING "btree" ("is_enabled") WHERE ("is_enabled" = true);



CREATE INDEX "idx_navigation_group" ON "public"."navigation_items" USING "btree" ("locale", "nav_group");



CREATE INDEX "idx_navigation_locale" ON "public"."navigation_items" USING "btree" ("locale");



CREATE INDEX "idx_navigation_parent" ON "public"."navigation_items" USING "btree" ("parent_id");



CREATE INDEX "idx_page_definitions_locale" ON "public"."page_definitions" USING "btree" ("locale");



CREATE INDEX "idx_page_definitions_published" ON "public"."page_definitions" USING "btree" ("is_published") WHERE ("is_published" = true);



CREATE INDEX "idx_page_definitions_slug" ON "public"."page_definitions" USING "btree" ("locale", "slug");



CREATE INDEX "idx_page_definitions_type" ON "public"."page_definitions" USING "btree" ("page_type");



CREATE INDEX "idx_page_sections_config" ON "public"."page_sections" USING "gin" ("config_json");



CREATE INDEX "idx_page_sections_enabled" ON "public"."page_sections" USING "btree" ("page_id", "is_enabled") WHERE ("is_enabled" = true);



CREATE INDEX "idx_page_sections_page" ON "public"."page_sections" USING "btree" ("page_id");



CREATE INDEX "idx_page_sections_position" ON "public"."page_sections" USING "btree" ("page_id", "position");



CREATE INDEX "idx_page_sections_type" ON "public"."page_sections" USING "btree" ("section_type");



CREATE INDEX "idx_product_categories_active" ON "public"."product_categories" USING "btree" ("is_active") WHERE ("is_active" = true);



CREATE INDEX "idx_product_categories_parent" ON "public"."product_categories" USING "btree" ("parent_id");



CREATE INDEX "idx_product_category_trans_locale" ON "public"."product_category_translations" USING "btree" ("locale");



CREATE INDEX "idx_product_feedback_trans_feedback" ON "public"."product_feedback_translations" USING "btree" ("feedback_id");



CREATE INDEX "idx_product_feedback_trans_locale" ON "public"."product_feedback_translations" USING "btree" ("feedback_id", "locale");



CREATE INDEX "idx_product_feedbacks_active" ON "public"."product_feedbacks" USING "btree" ("product_id", "is_active") WHERE ("is_active" = true);



CREATE INDEX "idx_product_feedbacks_order" ON "public"."product_feedbacks" USING "btree" ("product_id", "sort_order");



CREATE INDEX "idx_product_feedbacks_product" ON "public"."product_feedbacks" USING "btree" ("product_id");



CREATE INDEX "idx_product_media_primary" ON "public"."product_media" USING "btree" ("product_id", "is_primary") WHERE ("is_primary" = true);



CREATE INDEX "idx_product_media_product" ON "public"."product_media" USING "btree" ("product_id");



CREATE INDEX "idx_product_media_sort" ON "public"."product_media" USING "btree" ("product_id", "sort_order");



CREATE INDEX "idx_product_trans_locale" ON "public"."product_translations" USING "btree" ("locale");



CREATE INDEX "idx_product_trans_product" ON "public"."product_translations" USING "btree" ("product_id");



CREATE INDEX "idx_product_trans_slug" ON "public"."product_translations" USING "btree" ("locale", "slug");



CREATE INDEX "idx_products_active" ON "public"."products" USING "btree" ("is_active") WHERE ("is_active" = true);



CREATE INDEX "idx_products_category" ON "public"."products" USING "btree" ("category_id");



CREATE INDEX "idx_products_featured" ON "public"."products" USING "btree" ("is_featured") WHERE ("is_featured" = true);



CREATE INDEX "idx_products_new" ON "public"."products" USING "btree" ("is_new") WHERE ("is_new" = true);



CREATE INDEX "idx_redirects_enabled" ON "public"."redirects" USING "btree" ("is_enabled") WHERE ("is_enabled" = true);



CREATE UNIQUE INDEX "idx_redirects_from" ON "public"."redirects" USING "btree" ("from_path");



CREATE INDEX "idx_site_settings_key" ON "public"."site_settings" USING "btree" ("setting_key");



CREATE OR REPLACE TRIGGER "auto_slug_blog_translations" BEFORE INSERT OR UPDATE ON "public"."blog_translations" FOR EACH ROW EXECUTE FUNCTION "public"."auto_generate_blog_slug"();



CREATE OR REPLACE TRIGGER "auto_slug_product_translations" BEFORE INSERT OR UPDATE ON "public"."product_translations" FOR EACH ROW EXECUTE FUNCTION "public"."auto_generate_product_slug"();



CREATE OR REPLACE TRIGGER "site_settings_updated_at" BEFORE UPDATE ON "public"."site_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_site_settings_updated_at"();



CREATE OR REPLACE TRIGGER "update_blog_posts_updated_at" BEFORE UPDATE ON "public"."blog_posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_blog_translations_updated_at" BEFORE UPDATE ON "public"."blog_translations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_navigation_items_updated_at" BEFORE UPDATE ON "public"."navigation_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_page_definitions_updated_at" BEFORE UPDATE ON "public"."page_definitions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_page_sections_updated_at" BEFORE UPDATE ON "public"."page_sections" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_product_external_links_updated_at" BEFORE UPDATE ON "public"."product_external_links" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_product_feedback_translations_updated_at" BEFORE UPDATE ON "public"."product_feedback_translations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_product_feedbacks_updated_at" BEFORE UPDATE ON "public"."product_feedbacks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_product_translations_updated_at" BEFORE UPDATE ON "public"."product_translations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_products_updated_at" BEFORE UPDATE ON "public"."products" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_redirects_updated_at" BEFORE UPDATE ON "public"."redirects" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



ALTER TABLE ONLY "public"."blog_media"
    ADD CONSTRAINT "blog_media_blog_post_id_fkey" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."blog_translations"
    ADD CONSTRAINT "blog_translations_blog_post_id_fkey" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."blog_translations"
    ADD CONSTRAINT "blog_translations_locale_fkey" FOREIGN KEY ("locale") REFERENCES "public"."locales"("code");



ALTER TABLE ONLY "public"."media_assets"
    ADD CONSTRAINT "media_assets_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."media_folders"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."media_assets"
    ADD CONSTRAINT "media_assets_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."media_folders"
    ADD CONSTRAINT "media_folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."media_folders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."navigation_items"
    ADD CONSTRAINT "navigation_items_locale_fkey" FOREIGN KEY ("locale") REFERENCES "public"."locales"("code");



ALTER TABLE ONLY "public"."navigation_items"
    ADD CONSTRAINT "navigation_items_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation_items"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."page_definitions"
    ADD CONSTRAINT "page_definitions_locale_fkey" FOREIGN KEY ("locale") REFERENCES "public"."locales"("code");



ALTER TABLE ONLY "public"."page_sections"
    ADD CONSTRAINT "page_sections_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."page_definitions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_categories"
    ADD CONSTRAINT "product_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."product_category_translations"
    ADD CONSTRAINT "product_category_translations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_category_translations"
    ADD CONSTRAINT "product_category_translations_locale_fkey" FOREIGN KEY ("locale") REFERENCES "public"."locales"("code");



ALTER TABLE ONLY "public"."product_external_links"
    ADD CONSTRAINT "product_external_links_locale_fkey" FOREIGN KEY ("locale") REFERENCES "public"."locales"("code");



ALTER TABLE ONLY "public"."product_external_links"
    ADD CONSTRAINT "product_external_links_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_feedback_translations"
    ADD CONSTRAINT "product_feedback_translations_feedback_id_fkey" FOREIGN KEY ("feedback_id") REFERENCES "public"."product_feedbacks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_feedback_translations"
    ADD CONSTRAINT "product_feedback_translations_locale_fkey" FOREIGN KEY ("locale") REFERENCES "public"."locales"("code");



ALTER TABLE ONLY "public"."product_feedbacks"
    ADD CONSTRAINT "product_feedbacks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_media"
    ADD CONSTRAINT "product_media_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_translations"
    ADD CONSTRAINT "product_translations_locale_fkey" FOREIGN KEY ("locale") REFERENCES "public"."locales"("code");



ALTER TABLE ONLY "public"."product_translations"
    ADD CONSTRAINT "product_translations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."site_settings"
    ADD CONSTRAINT "site_settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."static_page_slots"
    ADD CONSTRAINT "static_page_slots_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."static_pages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."static_page_translations"
    ADD CONSTRAINT "static_page_translations_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."static_pages"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can do everything with media_assets" ON "public"."media_assets" TO "authenticated" USING ((("auth"."jwt"() ->> 'email'::"text") ~~ '%@plume.vn%'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'email'::"text") ~~ '%@plume.vn%'::"text"));



CREATE POLICY "Admins can do everything with media_folders" ON "public"."media_folders" TO "authenticated" USING ((("auth"."jwt"() ->> 'email'::"text") ~~ '%@plume.vn%'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'email'::"text") ~~ '%@plume.vn%'::"text"));



CREATE POLICY "Admins can manage all posts" ON "public"."blog_posts" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"))) WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can manage blog media" ON "public"."blog_media" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"))) WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can manage blog translations" ON "public"."blog_translations" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"))) WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can manage categories" ON "public"."product_categories" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"))) WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can manage category translations" ON "public"."product_category_translations" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"))) WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can manage locales" ON "public"."locales" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"))) WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can manage navigation" ON "public"."navigation_items" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"))) WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can manage product media" ON "public"."product_media" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"))) WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can manage product translations" ON "public"."product_translations" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"))) WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can manage redirects" ON "public"."redirects" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Authenticated users can delete feedback translations" ON "public"."product_feedback_translations" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can delete feedbacks" ON "public"."product_feedbacks" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can delete tiktok videos" ON "public"."tiktok_videos" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can insert feedback translations" ON "public"."product_feedback_translations" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert feedbacks" ON "public"."product_feedbacks" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert tiktok videos" ON "public"."tiktok_videos" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can manage external links" ON "public"."product_external_links" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can manage media" ON "public"."product_media" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can manage products" ON "public"."products" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can manage static_page_slots" ON "public"."static_page_slots" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can manage static_page_translations" ON "public"."static_page_translations" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can manage static_pages" ON "public"."static_pages" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can manage translations" ON "public"."product_translations" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can read all feedbacks" ON "public"."product_feedbacks" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can update feedback translations" ON "public"."product_feedback_translations" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Authenticated users can update feedbacks" ON "public"."product_feedbacks" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Authenticated users can update tiktok videos" ON "public"."tiktok_videos" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view all tiktok videos" ON "public"."tiktok_videos" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable ALL access for page_definitions" ON "public"."page_definitions" USING (true) WITH CHECK (true);



CREATE POLICY "Enable ALL access for page_sections" ON "public"."page_sections" USING (true) WITH CHECK (true);



CREATE POLICY "Public Read static_page_slots" ON "public"."static_page_slots" FOR SELECT USING (true);



CREATE POLICY "Public Read static_page_translations" ON "public"."static_page_translations" FOR SELECT USING (true);



CREATE POLICY "Public Read static_pages" ON "public"."static_pages" FOR SELECT USING (true);



CREATE POLICY "Public can read active categories" ON "public"."product_categories" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Public can read active feedbacks" ON "public"."product_feedbacks" FOR SELECT TO "anon" USING (("is_active" = true));



CREATE POLICY "Public can read active locales" ON "public"."locales" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Public can read category translations" ON "public"."product_category_translations" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."product_categories"
  WHERE (("product_categories"."id" = "product_category_translations"."category_id") AND ("product_categories"."is_active" = true)))));



CREATE POLICY "Public can read enabled navigation" ON "public"."navigation_items" FOR SELECT USING (("is_enabled" = true));



CREATE POLICY "Public can read external links" ON "public"."product_external_links" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Public can read feedback translations" ON "public"."product_feedback_translations" FOR SELECT USING (true);



CREATE POLICY "Public can read media" ON "public"."product_media" FOR SELECT USING (true);



CREATE POLICY "Public can read media of published posts" ON "public"."blog_media" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."blog_posts"
  WHERE (("blog_posts"."id" = "blog_media"."blog_post_id") AND (("blog_posts"."status")::"text" = 'published'::"text") AND ("blog_posts"."published_at" <= "now"())))));



CREATE POLICY "Public can read products" ON "public"."products" FOR SELECT USING (true);



CREATE POLICY "Public can read published posts" ON "public"."blog_posts" FOR SELECT USING (((("status")::"text" = 'published'::"text") AND ("published_at" <= "now"())));



CREATE POLICY "Public can read translations" ON "public"."product_translations" FOR SELECT USING (true);



CREATE POLICY "Public can read translations of published posts" ON "public"."blog_translations" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."blog_posts"
  WHERE (("blog_posts"."id" = "blog_translations"."blog_post_id") AND (("blog_posts"."status")::"text" = 'published'::"text") AND ("blog_posts"."published_at" <= "now"())))));



CREATE POLICY "Public can view enabled tiktok videos" ON "public"."tiktok_videos" FOR SELECT USING (("is_enabled" = true));



CREATE POLICY "Public can view media_assets" ON "public"."media_assets" FOR SELECT USING (true);



ALTER TABLE "public"."blog_media" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blog_translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."locales" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."media_assets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."media_folders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."navigation_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."page_definitions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."page_sections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_category_translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_external_links" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_feedback_translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_feedbacks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_media" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."redirects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."site_settings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "site_settings_authenticated_insert" ON "public"."site_settings" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "site_settings_authenticated_update" ON "public"."site_settings" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "site_settings_public_read" ON "public"."site_settings" FOR SELECT USING (true);



ALTER TABLE "public"."static_page_slots" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."static_page_translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."static_pages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tiktok_videos" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."auto_generate_blog_slug"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_generate_blog_slug"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_generate_blog_slug"() TO "service_role";



GRANT ALL ON FUNCTION "public"."auto_generate_product_slug"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_generate_product_slug"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_generate_product_slug"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_slug"("title" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_slug"("title" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_slug"("title" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_pages"("p_locale" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_pages"("p_locale" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_pages"("p_locale" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_blog_post_by_slug"("p_locale" character varying, "p_slug" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."get_blog_post_by_slug"("p_locale" character varying, "p_slug" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_blog_post_by_slug"("p_locale" character varying, "p_slug" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_navigation"("p_locale" character varying, "p_nav_group" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."get_navigation"("p_locale" character varying, "p_nav_group" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_navigation"("p_locale" character varying, "p_nav_group" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_page_content"("p_locale" character varying, "p_slug" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."get_page_content"("p_locale" character varying, "p_slug" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_page_content"("p_locale" character varying, "p_slug" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_product_by_slug"("p_locale" character varying, "p_slug" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."get_product_by_slug"("p_locale" character varying, "p_slug" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_product_by_slug"("p_locale" character varying, "p_slug" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_site_settings_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_site_settings_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_site_settings_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "service_role";



GRANT ALL ON TABLE "public"."blog_media" TO "anon";
GRANT ALL ON TABLE "public"."blog_media" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_media" TO "service_role";



GRANT ALL ON TABLE "public"."blog_posts" TO "anon";
GRANT ALL ON TABLE "public"."blog_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_posts" TO "service_role";



GRANT ALL ON TABLE "public"."blog_translations" TO "anon";
GRANT ALL ON TABLE "public"."blog_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_translations" TO "service_role";



GRANT ALL ON TABLE "public"."locales" TO "anon";
GRANT ALL ON TABLE "public"."locales" TO "authenticated";
GRANT ALL ON TABLE "public"."locales" TO "service_role";



GRANT ALL ON TABLE "public"."media_assets" TO "anon";
GRANT ALL ON TABLE "public"."media_assets" TO "authenticated";
GRANT ALL ON TABLE "public"."media_assets" TO "service_role";



GRANT ALL ON TABLE "public"."media_folders" TO "anon";
GRANT ALL ON TABLE "public"."media_folders" TO "authenticated";
GRANT ALL ON TABLE "public"."media_folders" TO "service_role";



GRANT ALL ON TABLE "public"."navigation_items" TO "anon";
GRANT ALL ON TABLE "public"."navigation_items" TO "authenticated";
GRANT ALL ON TABLE "public"."navigation_items" TO "service_role";



GRANT ALL ON TABLE "public"."page_definitions" TO "anon";
GRANT ALL ON TABLE "public"."page_definitions" TO "authenticated";
GRANT ALL ON TABLE "public"."page_definitions" TO "service_role";



GRANT ALL ON TABLE "public"."page_sections" TO "anon";
GRANT ALL ON TABLE "public"."page_sections" TO "authenticated";
GRANT ALL ON TABLE "public"."page_sections" TO "service_role";



GRANT ALL ON TABLE "public"."product_categories" TO "anon";
GRANT ALL ON TABLE "public"."product_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."product_categories" TO "service_role";



GRANT ALL ON TABLE "public"."product_category_translations" TO "anon";
GRANT ALL ON TABLE "public"."product_category_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."product_category_translations" TO "service_role";



GRANT ALL ON TABLE "public"."product_external_links" TO "anon";
GRANT ALL ON TABLE "public"."product_external_links" TO "authenticated";
GRANT ALL ON TABLE "public"."product_external_links" TO "service_role";



GRANT ALL ON TABLE "public"."product_feedback_translations" TO "anon";
GRANT ALL ON TABLE "public"."product_feedback_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."product_feedback_translations" TO "service_role";



GRANT ALL ON TABLE "public"."product_feedbacks" TO "anon";
GRANT ALL ON TABLE "public"."product_feedbacks" TO "authenticated";
GRANT ALL ON TABLE "public"."product_feedbacks" TO "service_role";



GRANT ALL ON TABLE "public"."product_media" TO "anon";
GRANT ALL ON TABLE "public"."product_media" TO "authenticated";
GRANT ALL ON TABLE "public"."product_media" TO "service_role";



GRANT ALL ON TABLE "public"."product_translations" TO "anon";
GRANT ALL ON TABLE "public"."product_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."product_translations" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."redirects" TO "anon";
GRANT ALL ON TABLE "public"."redirects" TO "authenticated";
GRANT ALL ON TABLE "public"."redirects" TO "service_role";



GRANT ALL ON TABLE "public"."site_settings" TO "anon";
GRANT ALL ON TABLE "public"."site_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."site_settings" TO "service_role";



GRANT ALL ON TABLE "public"."static_page_slots" TO "anon";
GRANT ALL ON TABLE "public"."static_page_slots" TO "authenticated";
GRANT ALL ON TABLE "public"."static_page_slots" TO "service_role";



GRANT ALL ON TABLE "public"."static_page_translations" TO "anon";
GRANT ALL ON TABLE "public"."static_page_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."static_page_translations" TO "service_role";



GRANT ALL ON TABLE "public"."static_pages" TO "anon";
GRANT ALL ON TABLE "public"."static_pages" TO "authenticated";
GRANT ALL ON TABLE "public"."static_pages" TO "service_role";



GRANT ALL ON TABLE "public"."tiktok_videos" TO "anon";
GRANT ALL ON TABLE "public"."tiktok_videos" TO "authenticated";
GRANT ALL ON TABLE "public"."tiktok_videos" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







