/**
 * Kie.ai Image Generation Script
 * 
 * Pre-generates all images for the CitizenMate landing page using
 * the Nano Banana 2 model via kie.ai API.
 * 
 * Usage: npx tsx scripts/generate-images.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

// ─── Configuration ──────────────────────────────────────────────
const KIE_API_BASE = "https://api.kie.ai/api/v1/jobs";
const API_KEY = process.env.KIE_API_KEY || "e4fc401761f2af571ada5f8837de3c63";
const OUTPUT_DIR = path.resolve(__dirname, "../public/generated");
const MAX_POLL_TIME_MS = 120_000;
const POLL_INTERVAL_MS = 3_000;
const DELAY_BETWEEN_REQUESTS_MS = 2_000; // avoid rate limiting

// ─── Consistent style prefix for all prompts ────────────────────
const STYLE_PREFIX =
  "Ultra-realistic, DSLR-quality editorial photograph shot on Canon EOS R5, 85mm f/1.4 lens. " +
  "Natural skin with visible pores, fine hair, and real texture — absolutely NO airbrushed, plastic, or AI-generated skin appearance. " +
  "Soft natural lighting with golden-hour warmth. Subtle film grain for authenticity. " +
  "Clean modern composition with shallow depth of field. Color palette: deep navy blue, warm gold, eucalyptus green, and sky blue accents. " +
  "Welcoming and aspirational mood. No text overlays unless specified. " +
  "Stock photography quality — indistinguishable from a real professional photo shoot.";

// ─── Image definitions ──────────────────────────────────────────
interface ImageDef {
  filename: string;
  prompt: string;
  aspect_ratio: string;
  resolution: string;
}

const IMAGES: ImageDef[] = [
  {
    filename: "hero-study.png",
    prompt: `${STYLE_PREFIX} A warm, inviting scene of a diverse multicultural group of adults studying together at a modern library or co-working space in Australia. The group includes people of South Asian, East Asian, Middle Eastern, African, and Latin American backgrounds — all smiling and engaged, helping each other learn. Visible through large windows behind them: iconic Australian scenery — harbour, blue sky, gum trees. Open books, a tablet showing quiz questions, and coffee cups on the table. The mood is hopeful, supportive, and celebratory of new beginnings in Australia.`,
    aspect_ratio: "16:9",
    resolution: "2K",
  },
  {
    filename: "feature-tests.png",
    prompt: `${STYLE_PREFIX} Close-up of a confident young woman of South Asian descent using a modern tablet to take a practice citizenship test. The screen shows a clean quiz interface with multiple-choice questions. She is seated at a bright, airy desk with an Australian flag pin on her notebook. Soft bokeh background of a modern Australian suburban home. Expression: focused yet calm. Feeling of preparation and empowerment.`,
    aspect_ratio: "3:2",
    resolution: "2K",
  },
  {
    filename: "feature-bilingual.png",
    prompt: `${STYLE_PREFIX} A warm scene of a young man of East Asian background studying with a bilingual book — English on one page and Chinese characters on the facing page. He is seated in a cozy Australian café with eucalyptus sprigs in a vase nearby. A phone shows a translation app. Books in multiple languages are stacked beside him — Arabic, Hindi, Vietnamese, Mandarin. The mood is inclusive and empowering — learning in your own language to succeed in English.`,
    aspect_ratio: "3:2",
    resolution: "2K",
  },
  {
    filename: "feature-progress.png",
    prompt: `${STYLE_PREFIX} A joyful young woman of African background looking at a laptop screen showing a beautiful dashboard with progress charts, green checkmarks, and achievement badges. She is pumping her fist in celebration. Setting: bright modern Australian apartment with a window showing a sunny suburban view. The laptop screen shows circular progress rings at 85% completion with green and gold colors. Mood: achievement, confidence, readiness.`,
    aspect_ratio: "3:2",
    resolution: "2K",
  },
  {
    filename: "how-it-works-bg.png",
    prompt: `${STYLE_PREFIX} A serene, abstract Australian landscape background. Soft rolling eucalyptus-covered hills under a vast blue sky with scattered clouds. Golden afternoon light bathes the scene. Gentle color palette of sage green, sky blue, soft gold, and cream. Minimal and clean — suitable as a subtle background image. Slightly blurred and dreamy, with a sense of openness and welcome.`,
    aspect_ratio: "16:9",
    resolution: "2K",
  },
  {
    filename: "social-proof-people.png",
    prompt: `${STYLE_PREFIX} A heartwarming group photo of newly inducted Australian citizens at a citizenship ceremony. A diverse group of 8-10 adults from many cultures — wearing smart casual clothes, some holding small Australian flags, all beaming with pride and joy. Behind them is a large Australian coat of arms banner. An older official in a suit is congratulating them. The group includes people of Indian, Filipino, Chinese, Lebanese, Somali, Colombian, and Vietnamese backgrounds. The mood is emotional, proud, and celebratory — the culmination of their citizenship journey.`,
    aspect_ratio: "16:9",
    resolution: "2K",
  },
  {
    filename: "cta-australia.png",
    prompt: `${STYLE_PREFIX} Breathtaking panoramic view of the Sydney Harbour at golden hour. The Opera House and Harbour Bridge are visible in warm golden light reflecting off the water. Silhouettes of a small diverse group of people — a family with children of mixed cultural backgrounds — standing on a lookout point, gazing at the view with arms around each other. The sky is painted in warm oranges, golds, and soft blues. The mood is hopeful, forward-looking — a family's exciting new chapter in Australia.`,
    aspect_ratio: "16:9",
    resolution: "2K",
  },
  {
    filename: "og-image.png",
    prompt: `${STYLE_PREFIX} A professional Open Graph social media card. A warm collage-style composition: on the left, a diverse group of happy multicultural adults holding Australian flags at a citizenship ceremony. On the right, a clean modern phone showing a quiz app with green checkmarks. In the center, bold clean text: "CitizenMate" in navy blue. Background: soft gradient from navy blue to warm gold. Australian Southern Cross stars subtly visible. The mood is professional, trustworthy, and inviting.`,
    aspect_ratio: "16:9",
    resolution: "2K",
  },
];

// ─── API functions ──────────────────────────────────────────────

async function createTask(imageDef: ImageDef): Promise<string> {
  const res = await fetch(`${KIE_API_BASE}/createTask`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "nano-banana-2",
      input: {
        prompt: imageDef.prompt,
        image_input: [],
        aspect_ratio: imageDef.aspect_ratio,
        resolution: imageDef.resolution,
        output_format: "png",
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`createTask failed: ${res.status} — ${text}`);
  }

  const json = await res.json();
  if (json.code !== 200) throw new Error(`createTask API error: ${json.msg}`);
  return json.data.taskId;
}

async function pollTask(taskId: string): Promise<string[]> {
  const start = Date.now();

  while (Date.now() - start < MAX_POLL_TIME_MS) {
    const res = await fetch(`${KIE_API_BASE}/recordInfo?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`pollTask failed: ${res.status} — ${text}`);
    }

    const json = await res.json();
    const state = json.data?.state;

    if (state === "success") {
      const result = JSON.parse(json.data.resultJson || "{}");
      return result.resultUrls || [];
    }

    if (state === "fail") {
      throw new Error(`Generation failed: ${json.data.failMsg || "unknown"}`);
    }

    process.stdout.write(".");
    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error(`Timed out after ${MAX_POLL_TIME_MS / 1000}s`);
}

function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(destPath);

    protocol.get(url, (response) => {
      // Follow redirects
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlinkSync(destPath);
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode && response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`Download failed: HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", (err) => {
      file.close();
      fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Main ───────────────────────────────────────────────────────

async function main() {
  console.log("🎨 CitizenMate Image Generator — Kie.ai Nano Banana 2\n");
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);

  // Ensure output dir exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Check which images already exist
  const existingFiles = fs.readdirSync(OUTPUT_DIR);
  const toGenerate = IMAGES.filter((img) => {
    if (existingFiles.includes(img.filename)) {
      console.log(`  ⏭  ${img.filename} — already exists, skipping`);
      return false;
    }
    return true;
  });

  if (toGenerate.length === 0) {
    console.log("\n✅ All images already generated! Delete files to regenerate.");
    return;
  }

  console.log(`\n🖼  Generating ${toGenerate.length} images...\n`);

  let success = 0;
  let failed = 0;

  for (const img of toGenerate) {
    try {
      process.stdout.write(`  🔄 ${img.filename}`);

      // Create task
      const taskId = await createTask(img);
      process.stdout.write(` [task: ${taskId}] `);

      // Poll until done
      const urls = await pollTask(taskId);

      if (!urls.length) {
        throw new Error("No result URLs returned");
      }

      // Download first result
      const destPath = path.join(OUTPUT_DIR, img.filename);
      await downloadFile(urls[0], destPath);

      const stats = fs.statSync(destPath);
      console.log(` ✅ (${(stats.size / 1024).toFixed(0)} KB)`);
      success++;
    } catch (err) {
      console.log(` ❌ ${err instanceof Error ? err.message : err}`);
      failed++;
    }

    // Delay between requests to avoid rate limiting
    if (toGenerate.indexOf(img) < toGenerate.length - 1) {
      await sleep(DELAY_BETWEEN_REQUESTS_MS);
    }
  }

  console.log(`\n📊 Results: ${success} generated, ${failed} failed, ${IMAGES.length - toGenerate.length} skipped`);
  console.log("🎉 Done!\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
