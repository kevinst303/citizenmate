import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      id,
      author_id,
      status,
      published_at,
      is_featured,
      reading_time,
      sort_order,
      created_at,
      updated_at,
      translations:blog_translations (
        id,
        locale,
        title,
        slug,
        excerpt,
        content,
        seo_title,
        seo_description,
        seo_keywords,
        og_image_url
      ),
      media:blog_media (
        id,
        url,
        alt_text,
        type,
        is_featured,
        sort_order,
        caption
      ),
      tags:blog_post_tags (
        tag:blog_tags (
          id,
          name,
          slug
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const posts = (data || []).map((row: Record<string, unknown>) => ({
    id: row.id,
    author_id: row.author_id,
    status: row.status,
    published_at: row.published_at,
    is_featured: row.is_featured,
    reading_time: row.reading_time,
    sort_order: row.sort_order,
    created_at: row.created_at,
    updated_at: row.updated_at,
    translations: row.translations || [],
    media: row.media || [],
    tags: ((row.tags as Array<{ tag: Record<string, unknown> }>) || []).map(
      (t: { tag: Record<string, unknown> }) => t.tag
    ),
  }));

  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { translation, status, is_featured, reading_time, tag_ids } = body;

    if (!translation || !translation.title || !translation.locale || !translation.slug) {
      return NextResponse.json(
        { error: 'Translation with title, locale, and slug is required' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .insert({
        author_id: admin.id,
        status: status || 'draft',
        is_featured: is_featured || false,
        reading_time: reading_time || null,
        published_at: status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (postError || !post) {
      return NextResponse.json({ error: postError?.message || 'Failed to create post' }, { status: 500 });
    }

    const { data: trans, error: transError } = await supabase
      .from('blog_translations')
      .insert({
        blog_post_id: post.id,
        locale: translation.locale,
        title: translation.title,
        slug: translation.slug,
        excerpt: translation.excerpt || null,
        content: translation.content || null,
        seo_title: translation.seo_title || null,
        seo_description: translation.seo_description || null,
        seo_keywords: translation.seo_keywords || null,
        og_image_url: translation.og_image_url || null,
      })
      .select()
      .single();

    if (transError) {
      await supabase.from('blog_posts').delete().eq('id', post.id);
      return NextResponse.json({ error: transError.message }, { status: 500 });
    }

    if (tag_ids && tag_ids.length > 0) {
      await supabase.from('blog_post_tags').insert(
        tag_ids.map((tag_id: string) => ({ blog_post_id: post.id, tag_id }))
      );
    }

    revalidatePath('/[lang]/blog', 'layout');

    return NextResponse.json({ post: { ...post, translation: trans, tags: tag_ids || [] } });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, status, published_at, is_featured, reading_time, sort_order, translation, tag_ids } = body;

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status !== undefined) {
      updateData.status = status;
      if (status === 'published' && published_at === undefined) {
        updateData.published_at = new Date().toISOString();
      }
    }
    if (published_at !== undefined) updateData.published_at = published_at;
    if (is_featured !== undefined) updateData.is_featured = is_featured;
    if (reading_time !== undefined) updateData.reading_time = reading_time;
    if (sort_order !== undefined) updateData.sort_order = sort_order;

    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (postError) {
      return NextResponse.json({ error: postError.message }, { status: 500 });
    }

    if (translation && translation.locale) {
      const { error: transError } = await supabase
        .from('blog_translations')
        .upsert(
          {
            blog_post_id: id,
            locale: translation.locale,
            title: translation.title,
            slug: translation.slug,
            excerpt: translation.excerpt,
            content: translation.content,
            seo_title: translation.seo_title,
            seo_description: translation.seo_description,
            seo_keywords: translation.seo_keywords,
            og_image_url: translation.og_image_url,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'blog_post_id,locale' }
        );

      if (transError) {
        return NextResponse.json({ error: transError.message }, { status: 500 });
      }
    }

    if (tag_ids !== undefined) {
      await supabase.from('blog_post_tags').delete().eq('blog_post_id', id);
      if (tag_ids.length > 0) {
        await supabase.from('blog_post_tags').insert(
          tag_ids.map((tag_id: string) => ({ blog_post_id: id, tag_id }))
        );
      }
    }

    revalidatePath('/[lang]/blog', 'layout');

    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath('/[lang]/blog', 'layout');

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
