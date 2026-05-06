import { createClient } from '@supabase/supabase-js';
import { parse } from 'marked';
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

  console.log(`Found ${posts.length} blog posts.`);

  let modifiedCount = 0;

  for (const post of posts) {
    const content = post.content as string;

    // Heuristic: If it has markdown headers or bold indicators
    if (content.includes('## ') || content.includes('**')) {
      console.log(`Migrating post ID: ${post.id}`);
      
      // Protect <QuizCTA ... /> blocks before parsing
      const ctaBlocks: string[] = [];
      let protectedContent = content.replace(/<QuizCTA[\s\S]*?\/>/g, (match) => {
        ctaBlocks.push(match);
        return `__QUIZ_CTA_${ctaBlocks.length - 1}__`;
      });

      let htmlContent = await parse(protectedContent);

      // Restore CTA blocks (marked might wrap the placeholder in a <p> tag)
      ctaBlocks.forEach((block, index) => {
        htmlContent = htmlContent.replace(`<p>__QUIZ_CTA_${index}__</p>`, block);
        htmlContent = htmlContent.replace(`__QUIZ_CTA_${index}__`, block);
      });

      if (!process.argv.includes('--dry-run')) {
        const { error: updateError } = await supabase
          .from('blog_translations')
          .update({ content: htmlContent.trim() })
          .eq('id', post.id);
        
        if (updateError) {
          console.error(`Error updating post ${post.id}:`, updateError);
        } else {
          console.log(`Successfully updated post ${post.id}`);
        }
      } else {
        console.log(`[DRY RUN] Would update post ${post.id}`);
      }

      modifiedCount++;
    }
  }

  console.log(`Completed. ${modifiedCount} posts ${process.argv.includes('--dry-run') ? 'would be' : 'were'} updated.`);
}

main();
