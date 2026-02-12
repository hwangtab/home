import { getRouterBasename, isProduction } from './utils/env';

describe('env utils', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalPublicUrl = process.env.PUBLIC_URL;
  const originalLocation = window.location;

  const setHostname = (hostname: string) => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, hostname }
    });
  };

  afterEach(() => {
    (process.env as any).NODE_ENV = originalEnv;
    (process.env as any).PUBLIC_URL = originalPublicUrl;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation
    });
  });

  test('returns production flag in test env', () => {
    expect(isProduction()).toBe(false);
  });

  test('returns github pages basename in production on github host', () => {
    (process.env as any).NODE_ENV = 'production';
    (process.env as any).PUBLIC_URL = '/something-else';
    setHostname('hwangtab.github.io');

    expect(getRouterBasename()).toBe('/home');
  });

  test('normalizes public url path for non github host', () => {
    (process.env as any).NODE_ENV = 'production';
    (process.env as any).PUBLIC_URL = 'https://example.com/home/';
    setHostname('example.com');

    expect(getRouterBasename()).toBe('/home');
  });
});
