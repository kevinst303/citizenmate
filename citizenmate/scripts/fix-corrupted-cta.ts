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

    // The corrupted pattern from earlier markdown to html conversion
    if (content.includes('<p><QuizCTA</p>') || content.includes('&lt;QuizCTA')) {
      const original = content;
      
      // Fix the <p><QuizCTA</p> ... <p>/></p> broken blocks
      // We will replace any `<p><QuizCTA</p>` followed by anything up to `<p>/></p>` with just `<QuizCTA />`
      content = content.replace(/<p><QuizCTA<\/p>[\s\S]*?<p>\/><\/p>/g, '<QuizCTA />');
      content = content.replace(/<QuizCTA[\s\S]*?\/>/g, '<QuizCTA />');

      // What if it was HTML encoded?
      content = content.replace(/&lt;QuizCTA[\s\S]*?\/&gt;/g, '<QuizCTA />');

      if (content !== original) {
        console.log(`Fixing corrupted CTAs in post ID: ${post.id}`);
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

  console.log(`Completed. ${modifiedCount} corrupted posts were updated.`);
}

main();
