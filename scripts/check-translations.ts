#!/usr/bin/env tsx
/**
 * check-translations.ts
 * Checks whether Korean strings in siteData.json have English mappings.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KO_TO_EN, translateSiteData } from '../src/utils/translateSiteData';
import { WORK_CATEGORIES } from '../src/types/data.types';
import type { SiteData, WorkCategory } from '../src/types/data.types';

const __dirname = dirname(fileURLToPath(import.meta.url));

const isKoreanText = (value: string): boolean => /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value);

function extractStrings(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => extractStrings(item));
  }

  if (value && typeof value === 'object') {
    return Object.values(value).flatMap((item) => extractStrings(item));
  }

  return [];
}

function extractLeafPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return [prefix];
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) =>
      extractLeafPaths(child, prefix ? `${prefix}.${key}` : key)
    );
  }

  return [prefix];
}

function checkLocaleParity(): void {
  const koPath = resolve(__dirname, '../src/locales/ko.json');
  const enPath = resolve(__dirname, '../src/locales/en.json');
  const ko = JSON.parse(readFileSync(koPath, 'utf-8')) as unknown;
  const en = JSON.parse(readFileSync(enPath, 'utf-8')) as unknown;

  const koPaths = extractLeafPaths(ko).sort();
  const enPaths = extractLeafPaths(en).sort();
  const koSet = new Set(koPaths);
  const enSet = new Set(enPaths);
  const koOnly = koPaths.filter((path) => !enSet.has(path));
  const enOnly = enPaths.filter((path) => !koSet.has(path));

  if (koOnly.length > 0 || enOnly.length > 0) {
    console.error('\nLocale files have mismatched translation keys.');

    if (koOnly.length > 0) {
      console.error('\nKeys only in src/locales/ko.json:');
      koOnly.forEach((path) => console.error(`  - ${path}`));
    }

    if (enOnly.length > 0) {
      console.error('\nKeys only in src/locales/en.json:');
      enOnly.forEach((path) => console.error(`  - ${path}`));
    }

    process.exit(1);
  }
}

function getWorkIdsByCategory(data: SiteData): Record<WorkCategory, string[]> {
  return Object.fromEntries(
    WORK_CATEGORIES.map((category) => [
      category,
      (data.works[category] ?? []).map((work) => work.id).sort()
    ])
  ) as Record<WorkCategory, string[]>;
}

function checkTranslatedSiteDataShape(data: SiteData): void {
  const translated = translateSiteData(data, 'en');
  const sourceIds = getWorkIdsByCategory(data);
  const translatedIds = getWorkIdsByCategory(translated);
  const errors: string[] = [];

  WORK_CATEGORIES.forEach((category) => {
    const source = sourceIds[category].join('\n');
    const target = translatedIds[category].join('\n');
    if (source !== target) {
      errors.push(`works.${category} IDs changed after translation.`);
    }
  });

  extractStrings(translated)
    .filter(isKoreanText)
    .forEach((value) => {
      errors.push(`Korean text remains after English translation: "${value.length > 80 ? `${value.slice(0, 80)}...` : value}"`);
    });

  if (errors.length > 0) {
    console.error('\nTranslated siteData failed integrity checks:');
    errors.forEach((error) => console.error(`  - ${error}`));
    process.exit(1);
  }
}

function main(): void {
  checkLocaleParity();

  const dataPath = resolve(__dirname, '../src/data/siteData.json');
  const raw = readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(raw) as SiteData;

  const strings = new Set<string>();
  extractStrings(data)
    .filter(isKoreanText)
    .forEach((value) => strings.add(value));

  const untranslated = [...strings].filter((value) => !(value in KO_TO_EN));

  if (untranslated.length > 0) {
    console.error('\nTranslation mappings missing for Korean siteData strings:');
    for (const value of untranslated.sort()) {
      const preview = value.length > 80 ? `${value.substring(0, 80)}...` : value;
      console.error(`  - "${preview}"`);
    }
    console.error(`\n${untranslated.length} string(s) need entries in src/utils/translateSiteData.ts.\n`);
    process.exit(1);
  }

  checkTranslatedSiteDataShape(data);

  console.log(`Locale keys checked: ko/en files match (${extractLeafPaths(JSON.parse(readFileSync(resolve(__dirname, '../src/locales/ko.json'), 'utf-8'))).length} keys).`);
  console.log(`siteData Korean strings checked: ${strings.size}. All have English mappings.`);
  console.log('Translated siteData integrity checked: work IDs preserved and no Korean text remains.');
}

main();
