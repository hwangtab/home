import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/seo';

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;

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
    host: SITE_URL
  };
}
