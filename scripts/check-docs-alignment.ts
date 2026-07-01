#!/usr/bin/env tsx

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const primaryGuidanceFiles = [
  'AGENTS.md',
  'CLAUDE.md',
  'gemini.md',
  'README.md',
  'QWEN.md',
  'docs/refactoring-plan.md'
] as const;

const forbiddenPatterns: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\bCreate React App\b/i, reason: 'The current app is Next.js App Router.' },
  { pattern: /\bReact Router\b/i, reason: 'Routing is owned by Next.js App Router.' },
  { pattern: /\breact-scripts\b/i, reason: 'The project does not use react-scripts.' },
  { pattern: /\bsrc\/pages\b/i, reason: 'Current route entries live under src/app.' },
  { pattern: /\bsrc\/App\.(js|tsx)\b/i, reason: 'There is no App root file in the current runtime.' },
  { pattern: /\bgh-pages\b/i, reason: 'Package scripts do not deploy through gh-pages.' },
  { pattern: /\bpredeploy\b/i, reason: 'Package scripts do not define predeploy.' },
  { pattern: /\bReact 18\.2\b/i, reason: 'package.json uses React 19.' },
  { pattern: /\bSPA\b/i, reason: 'Do not describe the current App Router site as an SPA.' },
  { pattern: /build\//i, reason: 'Do not describe Next.js build output as build/.' }
];

const staleKoreanRoutePattern = /\/ko\//;

const requiredPhrasesByFile: Record<string, string[]> = {
  'AGENTS.md': ['Next.js App Router', 'src/app/(ko)', 'src/app/(en)', 'src/views', 'src/data/siteData.json', 'npm test'],
  'CLAUDE.md': ['Next.js App Router', 'src/app/(ko)', 'src/app/(en)', 'src/views', 'src/data/siteData.json', 'npm test'],
  'gemini.md': ['Next.js App Router', 'src/app/(ko)', 'src/app/(en)', 'src/views', 'src/data/siteData.json', 'npm test'],
  'README.md': ['Next.js App Router', 'src/app/(ko)', 'src/app/(en)', 'src/views', 'src/data/siteData.json', 'npm test'],
  'QWEN.md': ['Next.js App Router', 'src/app/(ko)', 'src/app/(en)', 'src/views', 'siteData.json', 'npm test'],
  'docs/refactoring-plan.md': ['Next.js App Router', 'src/app/(ko)', 'src/app/(en)', 'src/views', 'siteData.json', 'npm test']
};

const read = (file: string): string => readFileSync(file, 'utf8');

for (const file of primaryGuidanceFiles) {
  const content = read(file);

  for (const { pattern, reason } of forbiddenPatterns) {
    assert.ok(!pattern.test(content), `${file} contains stale guidance matching ${pattern}: ${reason}`);
  }

  assert.ok(
    !staleKoreanRoutePattern.test(content),
    `${file} contains stale Korean route guidance using /ko/; Korean routes should be unprefixed and English should live under /en/*`
  );

  for (const phrase of requiredPhrasesByFile[file]) {
    assert.ok(content.includes(phrase), `${file} must mention current architecture phrase: ${phrase}`);
  }
}

const typescriptMigrationDoc = read('docs/typescript-migration.md');
assert.ok(
  typescriptMigrationDoc.startsWith('# TypeScript Migration Historical Record'),
  'docs/typescript-migration.md must be marked as a historical record.'
);
assert.ok(
  typescriptMigrationDoc.includes('The project is already TypeScript-first'),
  'docs/typescript-migration.md must state the current TypeScript-first status.'
);

const buildPattern = forbiddenPatterns.find((entry) => entry.reason === 'Do not describe Next.js build output as build/.');
assert.ok(buildPattern, 'Build output forbidden-pattern is required for docs alignment checks.');
assert.ok(buildPattern.pattern.test('build/'), 'build/ should be treated as forbidden architecture text.');
assert.ok(!buildPattern.pattern.test('prebuild'), 'Regex should not produce accidental broad-match without path separator.');

console.log(`Documentation alignment checked: ${primaryGuidanceFiles.length} primary guidance files.`);
