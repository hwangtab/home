import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.bugsm.co.kr' },
      { protocol: 'https', hostname: 'koreanmusicawards.com' },
      { protocol: 'https', hostname: 'poclanos.com' },
      { protocol: 'https', hostname: 'archivenew.vop.co.kr' },
      { protocol: 'https', hostname: '*.melon.com' },
      { protocol: 'https', hostname: 'www.youtube.com' },
      { protocol: 'https', hostname: 'img.youtube.com' }
    ]
  }
};

export default nextConfig;
