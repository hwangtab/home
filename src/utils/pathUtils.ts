/**
 * Resolves a path with the configured base path for deployment.
 * Uses NEXT_PUBLIC_BASE_PATH for Next.js static exports.
 */
export const resolvePath = (path: string): string => {
  const basePath = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_BASE_PATH || '' : '';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return basePath ? `${basePath}${normalized}` : normalized;
};

/**
 * Resolves a base path string for deployment.
 */
export const resolveBasePath = (): string => {
  return typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_BASE_PATH || '' : '';
};
