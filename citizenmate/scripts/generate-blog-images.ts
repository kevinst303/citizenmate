import fs from 'fs';
import path from 'path';

const KIE_API_BASE = "https://api.kie.ai/api/v1/jobs";
const KIE_API_KEY = process.env.KIE_API_KEY;

const TOPICS = [
  "fail-rates-2024",
  "test-difficulty-breakdown",
  "top-5-fail-reasons",
  "what-happens-if-you-fail",
  "truth-about-unofficial-tests",
  "trick-questions-vs-real-test",
  "hidden-traps-our-common-bond",
  "english-language-struggles",
  "australian-values-guarantee",
  "democracy-and-law-concepts",
  "top-10-australia-people-questions",
  "test-changes-2026",
  "two-week-study-plan",
  "balancing-work-prep",
  "pre-test-checklist",
  "ai-weakness-identification",
  "simulator-vs-free-tests",
  "conquering-test-anxiety",
  "behind-the-scenes-exam",
  "pr-to-citizen-guide"
];

async function createTask(prompt: string): Promise<string> {
  const res = await fetch(`${KIE_API_BASE}/createTask`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KIE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "nano-banana-2",
      input: {
        prompt,
        image_input: [],
        aspect_ratio: "16:9",
        resolution: "1K",
        output_format: "png",
      },
    }),
  });

  if (!res.ok) throw new Error(`Failed to create task: ${res.status}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(`API error: ${json.msg}`);
  return json.data.taskId;
}

async function pollTask(taskId: string, maxWaitMs = 120_000): Promise<string> {
  const startTime = Date.now();
  while (Date.now() - startTime < maxWaitMs) {
    const res = await fetch(`${KIE_API_BASE}/recordInfo?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${KIE_API_KEY}` },
    });
    const json = await res.json();
    
    if (json.data.state === "success") {
      const result = JSON.parse(json.data.resultJson || "{}");
      return result.resultUrls[0];
    }
    if (json.data.state === "fail") throw new Error("Generation failed");
    
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error("Timeout");
}

async function downloadImage(url: string, topic: string) {
  const publicDir = path.join(process.cwd(), 'public', 'images', 'blog');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const filePath = path.join(publicDir, `${topic}.png`);
  fs.writeFileSync(filePath, Buffer.from(buffer));
  console.log(`Saved: /images/blog/${topic}.png`);
}

async function main() {
  if (!KIE_API_KEY) {
    console.error("Please set KIE_API_KEY in environment variables.");
    process.exit(1);
  }

  console.log('Generating images for 20 blog posts in batches of 5...');
  
  const chunkSize = 5;
  for (let i = 0; i < TOPICS.length; i += chunkSize) {
    const chunk = TOPICS.slice(i, i + chunkSize);
    console.log(`\\nProcessing Batch ${Math.floor(i / chunkSize) + 1}...`);
    
    await Promise.all(chunk.map(async (topic) => {
      try {
        const prompt = `Ultra-realistic, multicultural, high-quality editorial photography representing the concept of: ${topic.replace(/-/g, ' ')} for an Australian citizenship blog. Shot on DSLR, 35mm lens, shallow depth of field, sharp focus, cinematic lighting, natural cinematic look, highly detailed, photorealistic. Professional, welcoming, motivating, Australian context, modern. No text or words in the image.`;
        
        const taskId = await createTask(prompt);
        console.log(`  [${topic}] Task ID: ${taskId}`);
        
        const imageUrl = await pollTask(taskId);
        console.log(`  [${topic}] Generated URL: ${imageUrl}`);
        
        await downloadImage(imageUrl, topic);
      } catch (error) {
        console.error(`  [${topic}] Error generating image:`, error);
      }
    }));
  }
  
  console.log('All images generated successfully!');
}

main().catch(console.error);
