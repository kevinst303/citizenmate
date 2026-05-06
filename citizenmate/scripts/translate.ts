/**
 * i18n Auto-Translation Script (Phase A)
 *
 * Uses DeepL API to translate missing keys from en.json into
 * target languages (ar, zh, hi, es), preserving existing translations.
 *
 * Usage:
 *   pnpm tsx scripts/translate.ts              # translate all missing keys
 *   pnpm tsx scripts/translate.ts --check-only # report drift without API calls
 *   pnpm tsx scripts/translate.ts --diff       # show what keys are missing (no API)
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as deepl from "deepl-node";

const DEEPL_TARGETS: Record<string, string> = {
  es: "ES",
  hi: "HI",
  zh: "ZH",
  ar: "AR",
};

const BATCH_SIZE = 50;
const INTERPOLATION_PATTERN = /\{(\w+)\}/g;

function loadDict(locale: string): Record<string, any> {
  const p = path.resolve(__dirname, "../src/i18n/dictionaries", `${locale}.json`);
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function saveDict(locale: string, dict: Record<string, any>): void {
  const p = path.resolve(__dirname, "../src/i18n/dictionaries", `${locale}.json`);
  fs.writeFileSync(p, JSON.stringify(dict, null, 2) + "\n");
}

function flattenKeys(
  obj: Record<string, any>,
  prefix = ""
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      result[fullKey] = value;
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenKeys(value, fullKey));
    }
  }
  return result;
}

function setNestedKey(
  obj: Record<string, any>,
  keyPath: string,
  value: string
): void {
  const parts = keyPath.split(".");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

function findMissingKeys(
  enFlat: Record<string, string>,
  targetFlat: Record<string, string>
): Record<string, string> {
  const missing: Record<string, string> = {};
  for (const [key, enValue] of Object.entries(enFlat)) {
    if (targetFlat[key] === undefined || targetFlat[key] === enValue) {
      missing[key] = enValue;
    }
  }
  return missing;
}

function protectTokens(text: string): { text: string; map: Record<string, string> } {
  const map: Record<string, string> = {};
  let placeholderCount = 0;
  const protectedText = text.replace(INTERPOLATION_PATTERN, (_match, varName) => {
    const placeholder = `__TOKEN_${placeholderCount++}__`;
    map[placeholder] = `{${varName}}`;
    return placeholder;
  });
  return { text: protectedText, map };
}

function restoreTokens(text: string, map: Record<string, string>): string {
  let result = text;
  for (const [placeholder, original] of Object.entries(map)) {
    result = result.replace(new RegExp(placeholder, "g"), original);
  }
  return result;
}

async function translateMissing(
  locale: string,
  missing: Record<string, string>
): Promise<Record<string, string>> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPL_API_KEY not set. Get one at https://www.deepl.com/pro-api");
  }

  const translator = new deepl.Translator(apiKey);
  const entries = Object.entries(missing);
  const results: Record<string, string> = {};

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const tokenMaps = batch.map(([, text]) => protectTokens(text));
    const protectedTexts = tokenMaps.map((t) => t.text);

    try {
      const translations: any = await translator.translateText(
        protectedTexts,
        null,
        DEEPL_TARGETS[locale] as any,
        {
          preserveFormatting: true,
          formality: "prefer_less",
        }
      );

      batch.forEach(([key], idx) => {
        const translated = Array.isArray(translations)
          ? translations[idx].text
          : translations.text;
        results[key] = restoreTokens(translated, tokenMaps[idx].map);
      });
    } catch (err) {
      console.error(`  Failed batch ${i}-${i + batch.length}:`, (err as Error).message);
    }
  }

  return results;
}

function mergeDict(
  targetDict: Record<string, any>,
  translated: Record<string, string>
): Record<string, any> {
  const merged = JSON.parse(JSON.stringify(targetDict));
  for (const [key, value] of Object.entries(translated)) {
    setNestedKey(merged, key, value);
  }
  return merged;
}

async function translateLocale(locale: string): Promise<number> {
  const enDict = loadDict("en");
  const targetDict = loadDict(locale);
  const enFlat = flattenKeys(enDict);
  const targetFlat = flattenKeys(targetDict);
  const missing = findMissingKeys(enFlat, targetFlat);

  if (Object.keys(missing).length === 0) {
    console.log(`  ${locale}: ✓ Up to date`);
    return 0;
  }

  console.log(`  ${locale}: ${Object.keys(missing).length} missing keys`);
  const translated = await translateMissing(locale, missing);
  const merged = mergeDict(targetDict, translated);
  saveDict(locale, merged);
  return Object.keys(missing).length;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const checkOnly = args.includes("--check-only");
  const diffOnly = args.includes("--diff");

  console.log("=== i18n Translation Tool ===\n");

  if (checkOnly || diffOnly) {
    const enDict = loadDict("en");
    const enFlat = flattenKeys(enDict);
    const enKeyCount = Object.keys(enFlat).length;
    console.log(`Source (en): ${enKeyCount} keys`);
    for (const locale of Object.keys(DEEPL_TARGETS)) {
      const targetDict = loadDict(locale);
      const targetFlat = flattenKeys(targetDict);
      const missing = findMissingKeys(enFlat, targetFlat);
      const missingCount = Object.keys(missing).length;
      const pct = ((missingCount / enKeyCount) * 100).toFixed(1);
      console.log(`  ${locale}: ${Object.keys(targetFlat).length}/${enKeyCount} keys, ${missingCount} missing (${pct}%)`);
      if (diffOnly && missingCount > 0) {
        console.log("    Missing keys:");
        for (const [key] of Object.entries(missing).slice(0, 10)) {
          console.log(`      - ${key}`);
        }
        if (missingCount > 10) console.log(`      ... and ${missingCount - 10} more`);
      }
    }
    return;
  }

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    console.error("DEEPL_API_KEY not set.");
    console.error("Get one at https://www.deepl.com/pro-api");
    console.error("Then run: DEEPL_API_KEY=your-key pnpm tsx scripts/translate.ts");
    process.exit(1);
  }

  const locales = Object.keys(DEEPL_TARGETS);
  let totalTranslated = 0;

  for (const locale of locales) {
    const count = await translateLocale(locale);
    totalTranslated += count;
  }

  console.log(`\nDone. ${totalTranslated} translations added.`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
