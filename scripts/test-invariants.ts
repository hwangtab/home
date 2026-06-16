#!/usr/bin/env tsx

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { getAllWorkSlugs, getLocalizedWorks, getWorkBySlug, getWorkCoverUrl } from '../src/lib/works';
import { getSiteData } from '../src/data/siteContent';
import { WORK_CATEGORIES, type WorkCategory } from '../src/types/data.types';
import { getLocaleFromPathname, stripLocalePrefix, withLocalePrefix } from '../src/utils/localePath';

process.env.NEXT_PUBLIC_SITE_URL = 'https://hwangtab.github.io';

const hasKoreanText = (value: string): boolean => /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value);

const assertPublicAssetExists = (assetPath: string): void => {
  assert.ok(assetPath.startsWith('/'), `Expected local asset path to start with "/": ${assetPath}`);
  assert.ok(
    existsSync(resolve(process.cwd(), 'public', assetPath.slice(1))),
    `Expected public asset to exist: ${assetPath}`
  );
};

const collectStrings = (value: unknown): string[] => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
};

const hostnameMatchesPattern = (hostname: string, pattern: string): boolean => {
  if (pattern.startsWith('*.')) {
    const suffix = pattern.slice(2);
    return hostname === suffix || hostname.endsWith(`.${suffix}`);
  }

  return hostname === pattern;
};

async function main(): Promise<void> {
  const [{ default: sitemap }, { default: robots }, { toAbsoluteUrl, SITE_URL }, { default: nextConfig }] = await Promise.all([
    import('../src/app/sitemap'),
    import('../src/app/robots'),
    import('../src/lib/seo'),
    import('../next.config.mjs')
  ]);

  assert.equal(getLocaleFromPathname('/'), 'ko');
  assert.equal(getLocaleFromPathname('/en'), 'en');
  assert.equal(getLocaleFromPathname('/en/works/no-control'), 'en');
  assert.equal(stripLocalePrefix('/en/works/no-control'), '/works/no-control');
  assert.equal(withLocalePrefix('/works/no-control', 'ko'), '/works/no-control');
  assert.equal(withLocalePrefix('/works/no-control', 'en'), '/en/works/no-control');
  assert.equal(toAbsoluteUrl('/works/no-control'), 'https://hwangtab.github.io/works/no-control');

  const koData = getSiteData('ko');
  const enData = getSiteData('en');
  assert.deepEqual(Object.keys(koData.works).sort(), Object.keys(enData.works).sort());
  assert.equal(SITE_URL, 'https://hwangtab.github.io');

  const koSlugs = getAllWorkSlugs();
  assert.equal(new Set(koSlugs).size, koSlugs.length, 'Work slugs must be unique.');
  assert.equal(koSlugs.length, getLocalizedWorks('ko').length);
  assert.equal(koSlugs.length, getLocalizedWorks('en').length);

  for (const category of WORK_CATEGORIES) {
    const koWorks = koData.works[category] ?? [];
    const enWorks = enData.works[category] ?? [];
    assert.deepEqual(
      enWorks.map((work) => work.id).sort(),
      koWorks.map((work) => work.id).sort(),
      `Translated work IDs must match for ${category}.`
    );
  }

  for (const slug of koSlugs) {
    const koWork = getWorkBySlug(slug, 'ko');
    const enWork = getWorkBySlug(slug, 'en');
    assert.ok(koWork, `Missing Korean work for slug ${slug}.`);
    assert.ok(enWork, `Missing English work for slug ${slug}.`);
    assert.equal(enWork?.id, koWork?.id);
    assert.equal(enWork?.category, koWork?.category);
  }

  const enStrings = collectStrings(enData);
  const koreanStringsInEnglishData = enStrings.filter(hasKoreanText);
  assert.deepEqual(koreanStringsInEnglishData, [], 'English site data must not contain Korean text.');

  const sitemapEntries = sitemap();
  const sitemapUrls = sitemapEntries.map((entry) => entry.url);
  assert.equal(sitemapUrls.length, 10 + koSlugs.length * 2);
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'Sitemap URLs must be unique.');
  assert.ok(sitemapUrls.every((url) => url.startsWith('https://hwangtab.github.io/')));
  assert.ok(sitemapUrls.includes('https://hwangtab.github.io/works/no-control'));
  assert.ok(sitemapUrls.includes('https://hwangtab.github.io/en/works/no-control'));

  const robotsConfig = robots();
  assert.equal(robotsConfig.sitemap, 'https://hwangtab.github.io/sitemap.xml');
  assert.equal(robotsConfig.host, 'https://hwangtab.github.io');

  const fallbackCovers: Record<WorkCategory, string> = {
    music: getWorkCoverUrl(undefined, 'music'),
    visual: getWorkCoverUrl(undefined, 'visual'),
    writing: getWorkCoverUrl(undefined, 'writing'),
    performance: getWorkCoverUrl(undefined, 'performance'),
    struggle: getWorkCoverUrl(undefined, 'struggle')
  };

  Object.values(fallbackCovers).forEach(assertPublicAssetExists);

  const remotePatterns = nextConfig.images?.remotePatterns ?? [];
  const remoteCoverUrls = getLocalizedWorks('ko')
    .map((work) => work.cover)
    .filter((cover): cover is string => typeof cover === 'string' && /^https?:\/\//.test(cover));

  remoteCoverUrls.forEach((cover) => {
    const url = new URL(cover);
    assert.ok(
      remotePatterns.some((pattern) =>
        pattern.protocol === url.protocol.replace(':', '') &&
        hostnameMatchesPattern(url.hostname, pattern.hostname)
      ),
      `Remote cover host is not allowed by next.config.mjs images.remotePatterns: ${url.hostname}`
    );
  });

  console.log(`Invariant tests passed: ${koSlugs.length} works, ${sitemapUrls.length} sitemap URLs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
