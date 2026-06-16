import type { MetadataRoute } from 'next';
import { SITE_URL, toAbsoluteUrl } from '../lib/seo';

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = toAbsoluteUrl('/sitemap.xml');
  const hostUrl = new URL(SITE_URL).origin;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/generate-favicons.html', '/images/og/generate-og-images.html', '/*.js.map', '/*.css.map'],
        crawlDelay: 1
      },
      {
        userAgent: 'Googlebot',
        allow: '/'
      },
      {
        userAgent: 'Bingbot',
        allow: '/'
      },
      {
        userAgent: 'NaverBot',
        allow: '/'
      },
      {
        userAgent: 'DaumBot',
        allow: '/'
      }
    ],
    sitemap: sitemapUrl,
    host: hostUrl
  };
}
