/**
 * Conseil-style Image Generator — Imagen 2 (Google AI)
 *
 * Generates stock photos for CitizenMate's Conseil design overhaul.
 * Prompts derived from Conseil's section imagery: hero bg, feature split,
 * operations/stats, and CTA band. Adapted for CitizenMate's Australian
 * citizenship theme.
 *
 * Usage:
 *   GOOGLE_AI_API_KEY=your_key node scripts/generate-conseil-images.mjs
 *
 * Output:  public/images/conseil/*.jpg
 * Credits: public/images/conseil/CREDITS.md
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "../public/images/conseil");
const CREDITS_FILE = join(OUTPUT_DIR, "CREDITS.md");

const API_KEY = process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!API_KEY) {
  console.error("Error: GOOGLE_AI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY env var is required.");
  process.exit(1);
}

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict";

// ─── Conseil-style style prefix ──────────────────────────────────
const STYLE =
  "Professional editorial photograph, DSLR quality. Clean modern composition. " +
  "Warm, neutral-toned corporate aesthetic — whites, light grays, teal accents. " +
  "Soft diffused lighting, shallow depth of field, subtle film grain. " +
  "Premium consulting website stock photography quality. No text overlays.";

// ─── Image definitions ────────────────────────────────────────────
const IMAGES = [
  {
    filename: "hero-bg.jpg",
    aspectRatio: "16:9",
    prompt: `${STYLE} Wide-angle hero background for an Australian citizenship preparation service. A diverse multicultural group of adults in a bright, modern coworking space — South Asian, East Asian, Middle Eastern, African backgrounds — engaged in focused study and quiet conversation. Large windows with soft natural light. Clean white desks, open laptops, notebooks. An Australian flag subtly visible in the background. Dark teal colour grading applied. Mood: aspirational, welcoming, professional. Suitable as a full-width hero background with a dark overlay.`,
  },
  {
    filename: "feature-split.jpg",
    aspectRatio: "4:3",
    prompt: `${STYLE} Right-side panel of a website feature split section. A young professional woman of South Asian background using a tablet showing a clean digital quiz or study interface. She is seated at a bright modern desk with Australian landscape visible through a window behind her. Soft bokeh, warm tones. The image should work well on the right side of a two-column layout. Mood: confident, empowered, prepared.`,
  },
  {
    filename: "operations.jpg",
    aspectRatio: "4:3",
    prompt: `${STYLE} Professional operations or statistics section image for a consulting/education platform. A team of three diverse adults — man of African descent, woman of East Asian descent, and a person of South Asian background — collaborating around a screen showing charts and progress metrics. Modern bright office environment. Teal accent colours visible in decor. Mood: team success, data-driven, professional achievement.`,
  },
  {
    filename: "cta-bg.jpg",
    aspectRatio: "16:9",
    prompt: `${STYLE} Full-width CTA section background for an Australian-themed service. Sydney Harbour Bridge or Opera House at golden hour, dramatic sky, soft teal/dark overlay applied. Clean, professional travel photography quality. The image should support a dark teal colour overlay (rgba 0,90,97,0.7) with white text on top. Mood: aspiration, opportunity, new beginning in Australia.`,
  },
];

// ─── API call ─────────────────────────────────────────────────────
async function generateImage(image) {
  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instances: [{ prompt: image.prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: image.aspectRatio,
        safetyFilterLevel: "block_only_high",
        personGeneration: "allow_adult",
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Imagen 2 API error for ${image.filename}: ${err}`);
  }

  const json = await response.json();
  const base64 = json?.predictions?.[0]?.bytesBase64Encoded;
  if (!base64) {
    throw new Error(`No image data returned for ${image.filename}`);
  }
  return Buffer.from(base64, "base64");
}

// ─── Main ─────────────────────────────────────────────────────────
async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const credits = [
    "# Conseil Image Credits",
    "",
    "Generated with Google Imagen 2 API.",
    `Date: ${new Date().toISOString().split("T")[0]}`,
    "",
  ];

  for (const image of IMAGES) {
    process.stdout.write(`Generating ${image.filename}... `);
    try {
      const buffer = await generateImage(image);
      const outPath = join(OUTPUT_DIR, image.filename);
      writeFileSync(outPath, buffer);
      console.log(`done (${Math.round(buffer.length / 1024)}KB)`);
      credits.push(`## ${image.filename}`);
      credits.push(`**Aspect ratio:** ${image.aspectRatio}`);
      credits.push(`**Prompt:** ${image.prompt}`);
      credits.push("");
    } catch (err) {
      console.error(`FAILED: ${err.message}`);
      credits.push(`## ${image.filename}`);
      credits.push(`**Status:** FAILED — ${err.message}`);
      credits.push("");
    }
  }

  writeFileSync(CREDITS_FILE, credits.join("\n"));
  console.log(`\nCredits saved to ${CREDITS_FILE}`);
}

main();
