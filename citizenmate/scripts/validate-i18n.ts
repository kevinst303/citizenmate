/**
 * i18n Dictionary Validation Script (Phase B)
 *
 * Checks dictionary integrity across all languages:
 * 1. All sections exist in all languages
 * 2. All keys from en.json exist in all languages
 * 3. No orphaned keys (in target but not en.json)
 * 4. Interpolation tokens match
 *
 * Usage:
 *   pnpm tsx scripts/validate-i18n.ts              # strict (fails on any gap)
 *   pnpm tsx scripts/validate-i18n.ts --warn-only  # warns but exits 0
 *   pnpm tsx scripts/validate-i18n.ts --json       # output JSON for CI
 */

import * as fs from "node:fs";
import * as path from "node:path";

const LOCALES = ["es", "hi", "zh", "ar"];
const INTERPOLATION_PATTERN = /\{(\w+)\}/g;

interface ValidationResult {
  locale: string;
  sections?: string[];
  missingSections?: string[];
  extraSections?: string[];
  missingKeys: string[];
  extraKeys: string[];
  tokenMismatches: string[];
  driftPercent: number;
}

function loadDict(locale: string): Record<string, any> {
  const p = path.resolve(__dirname, "../src/i18n/dictionaries", `${locale}.json`);
  return JSON.parse(fs.readFileSync(p, "utf-8"));
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
    } else if (typeof value === "object" && value !== null) {
      Object.assign(result, flattenKeys(value, fullKey));
    }
  }
  return result;
}

function extractTokens(text: string): string[] {
  const tokens: string[] = [];
  let match;
  while ((match = INTERPOLATION_PATTERN.exec(text)) !== null) {
    tokens.push(match[1]);
  }
  return tokens;
}

function validateLocale(locale: string): ValidationResult {
  const enDict = loadDict("en");
  const targetDict = loadDict(locale);
  const enFlat = flattenKeys(enDict);
  const targetFlat = flattenKeys(targetDict);

  const enKeys = new Set(Object.keys(enFlat));
  const targetKeys = new Set(Object.keys(targetFlat));

  const enSections = Object.keys(enDict);
  const targetSections = Object.keys(targetDict);

  const missingSections = enSections.filter((s) => !targetSections.includes(s));
  const extraSections = targetSections.filter((s) => !enSections.includes(s));
  const missingKeys = [...enKeys].filter((k) => !targetKeys.has(k));
  const extraKeys = [...targetKeys].filter((k) => !enKeys.has(k));

  const tokenMismatches: string[] = [];
  for (const key of enKeys) {
    if (targetFlat[key]) {
      const enTokens = extractTokens(enFlat[key]).sort().join(",");
      const targetTokens = extractTokens(targetFlat[key]).sort().join(",");
      if (enTokens !== targetTokens) {
        tokenMismatches.push(
          `${key}: en=[${enTokens}] ${locale}=[${targetTokens}]`
        );
      }
    }
  }

  const totalEn = enKeys.size;
  const drift = totalEn > 0 ? (missingKeys.length / totalEn) * 100 : 0;

  return {
    locale,
    sections: enSections,
    missingSections,
    extraSections,
    missingKeys,
    extraKeys,
    tokenMismatches,
    driftPercent: Math.round(drift * 10) / 10,
  };
}

function main(): void {
  const args = process.argv.slice(2);
  const warnOnly = args.includes("--warn-only");
  const jsonOutput = args.includes("--json");

  const results: ValidationResult[] = [];
  let hasErrors = false;

  for (const locale of LOCALES) {
    const result = validateLocale(locale);
    results.push(result);

    if (
      (result.missingSections && result.missingSections.length > 0) ||
      result.missingKeys.length > 0 ||
      result.extraKeys.length > 0 ||
      result.tokenMismatches.length > 0
    ) {
      hasErrors = true;
    }
  }

  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
    process.exit(hasErrors && !warnOnly ? 1 : 0);
  }

  console.log("=== i18n Dictionary Validation ===\n");

  for (const result of results) {
    const status =
      result.missingKeys.length === 0 && result.tokenMismatches.length === 0
        ? "✓ PASS"
        : "✗ FAIL";

    console.log(`${status}  ${result.locale}  (drift: ${result.driftPercent}%)`);

    if (result.missingSections && result.missingSections.length > 0) {
      console.log(`  Missing sections: ${result.missingSections.join(", ")}`);
    }
    if (result.extraSections && result.extraSections.length > 0) {
      console.log(`  Extra sections: ${result.extraSections.join(", ")}`);
    }
    if (result.missingKeys.length > 0) {
      console.log(`  Missing keys: ${result.missingKeys.length}`);
      for (const k of result.missingKeys.slice(0, 5)) {
        console.log(`    - ${k}`);
      }
      if (result.missingKeys.length > 5) {
        console.log(`    ... and ${result.missingKeys.length - 5} more`);
      }
    }
    if (result.extraKeys.length > 0) {
      console.log(`  Extra keys: ${result.extraKeys.length}`);
      for (const k of result.extraKeys.slice(0, 5)) {
        console.log(`    - ${k}`);
      }
    }
    if (result.tokenMismatches.length > 0) {
      console.log(`  Token mismatches: ${result.tokenMismatches.length}`);
      for (const m of result.tokenMismatches.slice(0, 3)) {
        console.log(`    ${m}`);
      }
    }
  }

  if (warnOnly) {
    console.log("\n(--warn-only mode, exiting 0)");
    process.exit(0);
  }

  if (hasErrors) {
    console.log("\n✗ Validation failed. Run 'pnpm translate' to fix.");
    process.exit(1);
  }
}

main();
