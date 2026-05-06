/**
 * Seed script: imports all MDX blog posts into the Supabase blog_posts table.
 *
 * Usage:
 *   npx tsx scripts/seed-blog-posts.ts
 *
 * This outputs SQL INSERT statements to stdout.
 * Pipe to a file or copy-paste into Supabase Dashboard SQL Editor.
 *
 * To get the admin user's UUID (for author_id), run this in SQL Editor:
 *   SELECT id FROM public.profiles WHERE is_admin = true LIMIT 1;
 */

import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.resolve(__dirname, "../src/content/blog");
const ADMIN_UUID = process.env.ADMIN_UUID || "REPLACE_WITH_YOUR_ADMIN_USER_UUID";

interface PostFrontmatter {
  title: string;
  slug?: string;
  date: string;
  description?: string;
  category?: string;
  image?: string;
}

function escapeSql(str: string): string {
  return str.replace(/'/g, "''").replace(/\\/g, "\\\\");
}

function main() {
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  console.log("-- Seed blog posts from MDX files");
  console.log(`-- Generated: ${new Date().toISOString()}`);
  console.log(`-- Posts: ${files.length}`);
  console.log();

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const fm = data as PostFrontmatter;

    // Derive slug from filename if not in frontmatter
    const slug = fm.slug || file.replace(/\.mdx$/, "");

    // Parse date — if date is before the migration timestamp or in the past, set published = true
    const publishedAt = fm.date ? new Date(fm.date).toISOString() : new Date().toISOString();
    const published = true; // All existing posts are published

    const title = escapeSql(fm.title);
    const slugEsc = escapeSql(slug);
    const contentEsc = escapeSql(content.trim());
    const desc = fm.description ? escapeSql(fm.description) : "";

    console.log(
      `INSERT INTO public.blog_posts (title, slug, content, published, published_at, author_id, created_at, updated_at)`
    );
    console.log(
      `VALUES ('${title}', '${slugEsc}', '${contentEsc}', ${published}, '${publishedAt}', '${ADMIN_UUID}', '${publishedAt}', '${publishedAt}')`
    );
    console.log(`ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, published_at = EXCLUDED.published_at, updated_at = now();`);
    console.log();
  }

  console.log(`-- Done. ${files.length} posts seeded.`);
}

main();
