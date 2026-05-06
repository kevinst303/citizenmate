import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: posts, error } = await supabase
    .from('blog_translations')
    .select('id, content');

  if (error) {
    console.error('Error fetching posts:', error);
    process.exit(1);
  }

  let modifiedCount = 0;

  for (const post of posts) {
    let content = post.content as string;

    if (content.includes('QUIZ_CTA')) {
      const original = content;
      content = content.replace(/<p><strong>QUIZ_CTA_\d+<\/strong><\/p>/g, '<QuizCTA />');
      // Also catch any case where it might just be <strong>QUIZ_CTA_...</strong> without <p>
      content = content.replace(/<strong>QUIZ_CTA_\d+<\/strong>/g, '<QuizCTA />');
      // And in case it wasn't strong:
      content = content.replace(/__QUIZ_CTA_\d+__/g, '<QuizCTA />');

      if (content !== original) {
        console.log(`Fixing CTAs in post ID: ${post.id}`);
        const { error: updateError } = await supabase
          .from('blog_translations')
          .update({ content: content.trim() })
          .eq('id', post.id);
        
        if (updateError) {
          console.error(`Error updating post ${post.id}:`, updateError);
        } else {
          modifiedCount++;
        }
      }
    }
  }

  console.log(`Completed. ${modifiedCount} posts were updated.`);
}

main();
