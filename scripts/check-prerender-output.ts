#!/usr/bin/env tsx

import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const readBuiltHtml = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), '.next/server/app', relativePath), 'utf-8');
};

const appDir = resolve(process.cwd(), '.next/server/app');
const publicDir = resolve(process.cwd(), 'public');

const walkHtmlFiles = (dir: string): string[] => {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      return walkHtmlFiles(fullPath);
    }
    return fullPath.endsWith('.html') ? [fullPath] : [];
  });
};

const toRelativeAppPath = (fullPath: string): string => {
  return fullPath.slice(appDir.length + 1);
};

const stripNonVisibleMarkup = (html: string): string => {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<template\b[\s\S]*?<\/template>/gi, '')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
};

const decodeAttributeUrl = (value: string): string => {
  return value.replace(/&amp;/g, '&');
};

const routeExists = (path: string): boolean => {
  const normalized = path === '/' ? '/index' : path.replace(/\/+$/, '');
  return [
    resolve(appDir, `${normalized}.html`.replace(/^\/+/, '')),
    resolve(appDir, normalized.replace(/^\/+/, ''), 'index.html')
  ].some((candidate) => existsSync(candidate));
};

const assertInternalLinksResolve = (html: string, label: string): void => {
  const missingRoutes: string[] = [];
  const missingAssets: string[] = [];
  const attributes = html.matchAll(/\s(?:href|src|srcSet)="([^"]+)"/g);

  for (const match of attributes) {
    const rawValue = decodeAttributeUrl(match[1]);
    const values = match[0].includes('srcSet=')
      ? rawValue.split(',').map((item) => item.trim().split(/\s+/)[0]).filter(Boolean)
      : [rawValue];

    values.forEach((value) => {
      if (!value.startsWith('/') || value.startsWith('//')) return;
      if (value.startsWith('/_next/')) return;
      if (value.startsWith('/_next/image')) return;
      if (value.startsWith('/api/')) return;
      if (value.includes('#')) return;

      const pathname = value.split(/[?#]/)[0];

      if (
        pathname.startsWith('/images/') ||
        pathname === '/favicon.ico' ||
        pathname === '/favicon.svg' ||
        pathname === '/manifest.json' ||
        /^\/logo\d+\.png$/.test(pathname)
      ) {
        if (!existsSync(resolve(publicDir, pathname.slice(1)))) {
          missingAssets.push(pathname);
        }
        return;
      }

      if (!routeExists(pathname)) {
        missingRoutes.push(pathname);
      }
    });
  }

  assert.deepEqual([...new Set(missingRoutes)].sort(), [], `${label} links to missing local routes.`);
  assert.deepEqual([...new Set(missingAssets)].sort(), [], `${label} references missing local assets.`);
};

const assertNoRawTranslationKeys = (html: string, label: string): void => {
  const visibleText = stripNonVisibleMarkup(html);
  const rawKeys = visibleText.match(/\b(?:nav|common|home|about|works|news|contact|footer|player)\.[A-Za-z0-9_.-]+/g) ?? [];
  assert.deepEqual([...new Set(rawKeys)].sort(), [], `${label} exposes raw translation keys.`);
};

const assertNoVisibleInvalidTokens = (html: string, label: string): void => {
  const visibleText = stripNonVisibleMarkup(html);
  const invalidTokens = visibleText.match(/\b(?:undefined|NaN)\b/g) ?? [];
  assert.deepEqual([...new Set(invalidTokens)].sort(), [], `${label} exposes invalid placeholder tokens.`);
};

const assertSeoLinks = (html: string, label: string): void => {
  if (label.includes('_global-error') || label.includes('_not-found')) return;
  assert.match(html, /<link rel="canonical" href="https:\/\/hwangtab\.github\.io[^"]*"/, `${label} is missing canonical URL.`);
  assert.match(html, /<link rel="alternate" hrefLang="ko" href="https:\/\/hwangtab\.github\.io[^"]*"/, `${label} is missing Korean alternate URL.`);
  assert.match(html, /<link rel="alternate" hrefLang="en" href="https:\/\/hwangtab\.github\.io\/en[^"]*"/, `${label} is missing English alternate URL.`);
};

const assertWorksPageIsPrerendered = (html: string, label: string, expectedTitle: string): void => {
  assert.ok(!html.includes('작품 로딩 중'), `${label} should not prerender only the Korean loading fallback.`);
  assert.ok(!html.includes('Loading works...'), `${label} should not prerender only the English loading fallback.`);
  assert.ok(html.includes(expectedTitle), `${label} should include a real work title in prerendered HTML.`);
};

const htmlFiles = walkHtmlFiles(appDir);
assert.ok(htmlFiles.length >= 60, 'Expected prerendered app HTML files to exist. Run npm run build first.');

htmlFiles.forEach((file) => {
  const label = toRelativeAppPath(file);
  const html = readFileSync(file, 'utf-8');
  assertNoRawTranslationKeys(html, label);
  assertNoVisibleInvalidTokens(html, label);
  assertInternalLinksResolve(html, label);
  assertSeoLinks(html, label);
});

const koContactHtml = readBuiltHtml('contact.html');
const enContactHtml = readBuiltHtml('en/contact.html');
const koWorksHtml = readBuiltHtml('works.html');
const enWorksHtml = readBuiltHtml('en/works.html');
const koNotFoundHtml = readBuiltHtml('_not-found.html');
const koDetailHtml = readBuiltHtml('works/no-control.html');
const enDetailHtml = readBuiltHtml('en/works/no-control.html');

assertNoRawTranslationKeys(koContactHtml, 'Korean contact page');
assertNoRawTranslationKeys(enContactHtml, 'English contact page');
assertWorksPageIsPrerendered(koWorksHtml, 'Korean works page', '젠트리피케이션');
assertWorksPageIsPrerendered(enWorksHtml, 'English works page', 'Gentrification');
assert.ok(koDetailHtml.includes('No Control'), 'Korean work detail should include No Control.');
assert.ok(enDetailHtml.includes('No Control'), 'English work detail should include No Control.');
assert.ok(koNotFoundHtml.includes('Page Not Found'), 'Root not-found page should include a fallback 404 message.');

console.log(`Prerender output checks passed: ${htmlFiles.length} HTML files checked.`);
