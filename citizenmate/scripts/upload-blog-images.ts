/**
 * Uploads blog images to Supabase Storage and updates blog_media URLs.
 *
 * Usage: npx tsx scripts/upload-blog-images.ts
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const IMAGE_DIR = path.resolve(process.cwd(), 'public/images/blog');

async function main() {
  // Get all blog_translations with their post IDs
  const { data: translations, error } = await supabase
    .from('blog_translations')
    .select('blog_post_id, slug')
    .eq('locale', 'en');

  if (error || !translations) {
    console.error('Failed to fetch translations:', error?.message);
    process.exit(1);
  }

  console.log(`Found ${translations.length} posts to process.\n`);

  let uploaded = 0;
  let skipped = 0;

  for (const trans of translations) {
    const slug = trans.slug;
    const postId = trans.blog_post_id;
    const imageFile = path.join(IMAGE_DIR, `${slug}.webp`);

    if (!fs.existsSync(imageFile)) {
      console.log(`  ⚠  No image for: ${slug} (expected ${slug}.webp)`);
      skipped++;
      continue;
    }

    const fileBuffer = fs.readFileSync(imageFile);
    const storagePath = `${postId}/${slug}.webp`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: true,
      });

    if (uploadError) {
      console.error(`  ✗  Upload failed for ${slug}: ${uploadError.message}`);
      continue;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // Update blog_media record
    const { error: updateMediaError } = await supabase
      .from('blog_media')
      .update({ url: publicUrl })
      .eq('blog_post_id', postId)
      .eq('is_featured', true);

    if (updateMediaError) {
      console.error(`  ✗  Failed to update media for ${slug}: ${updateMediaError.message}`);
    }

    // Also update og_image_url in blog_translations
    const { error: updateOgError } = await supabase
      .from('blog_translations')
      .update({ og_image_url: publicUrl })
      .eq('blog_post_id', postId)
      .eq('locale', 'en');

    if (updateOgError) {
      console.error(`  ✗  Failed to update og_image for ${slug}: ${updateOgError.message}`);
    }

    uploaded++;
    console.log(`  ✓  ${slug} → ${publicUrl}`);
  }

  console.log(`\nDone. Uploaded: ${uploaded}, Skipped: ${skipped}`);
}

main().catch(console.error);
