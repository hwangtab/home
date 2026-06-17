#!/usr/bin/env tsx

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const readBuiltHtml = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), '.next/server/app', relativePath), 'utf-8');
};

const assertNoRawTranslationKeys = (html: string, label: string): void => {
  const rawKeys = html.match(/\b(?:nav|common|home|about|works|news|contact|footer)\.[A-Za-z0-9_.-]+/g) ?? [];
  assert.deepEqual([...new Set(rawKeys)].sort(), [], `${label} exposes raw translation keys.`);
};

const assertWorksPageIsPrerendered = (html: string, label: string, expectedTitle: string): void => {
  assert.ok(!html.includes('작품 로딩 중'), `${label} should not prerender only the Korean loading fallback.`);
  assert.ok(!html.includes('Loading works...'), `${label} should not prerender only the English loading fallback.`);
  assert.ok(html.includes(expectedTitle), `${label} should include a real work title in prerendered HTML.`);
};

const koContactHtml = readBuiltHtml('contact.html');
const enContactHtml = readBuiltHtml('en/contact.html');
const koWorksHtml = readBuiltHtml('works.html');
const enWorksHtml = readBuiltHtml('en/works.html');

assertNoRawTranslationKeys(koContactHtml, 'Korean contact page');
assertNoRawTranslationKeys(enContactHtml, 'English contact page');
assertWorksPageIsPrerendered(koWorksHtml, 'Korean works page', '젠트리피케이션');
assertWorksPageIsPrerendered(enWorksHtml, 'English works page', 'Gentrification');

console.log('Prerender output checks passed.');
