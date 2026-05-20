import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'image.bugsm.co.kr' },
      { protocol: 'https', hostname: 'koreanmusicawards.com' },
      { protocol: 'https', hostname: 'poclanos.com' },
      { protocol: 'https', hostname: 'archivenew.vop.co.kr' },
      { protocol: 'https', hostname: '*.melon.com' },
      { protocol: 'https', hostname: 'www.youtube.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'contents.kyobobook.co.kr' },
      { protocol: 'https', hostname: 'image.aladin.co.kr' },
      { protocol: 'https', hostname: 'alf.seoul.kr' }
    ]
  }
};

export default nextConfig;
