#!/usr/bin/env tsx

import assert from 'node:assert/strict';
import { spawn, type ChildProcess } from 'node:child_process';
import { chromium, type Browser, type ConsoleMessage, type Page, type Request } from 'playwright';

const PORT = Number(process.env.SMOKE_PORT || 3130);
const BASE_URL = `http://127.0.0.1:${PORT}`;

type ViewportCase = {
  name: string;
  width: number;
  height: number;
};

const viewports: ViewportCase[] = [
  { name: 'desktop', width: 1366, height: 900 },
  { name: 'mobile', width: 390, height: 844 }
];

const routes = [
  { path: '/', text: '황경하' },
  { path: '/about', text: '소개' },
  { path: '/works', text: '젠트리피케이션' },
  { path: '/works/no-control', text: 'No Control' },
  { path: '/news', text: '소식' },
  { path: '/contact', text: '연락처' },
  { path: '/en', text: 'Hwang Gyeongha' },
  { path: '/en/works', text: 'Gentrification' },
  { path: '/en/works/no-control', text: 'No Control' },
  { path: '/en/contact', text: 'Contact' },
  { path: '/works/not-a-real-work', text: '페이지를 찾을 수 없습니다', status: 404 },
  { path: '/en/works/not-a-real-work', text: 'Page Not Found', status: 404 }
];

const waitForServer = async (server: ChildProcess): Promise<void> => {
  const startedAt = Date.now();
  let lastError: unknown;

  while (Date.now() - startedAt < 30000) {
    if (server.exitCode !== null) {
      throw new Error(`next start exited early with code ${server.exitCode}`);
    }

    try {
      const response = await fetch(BASE_URL);
      if (response.ok) {
        return;
      }
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${BASE_URL}: ${String(lastError)}`);
};

const startServer = async (): Promise<ChildProcess> => {
  const server = spawn('npm', ['start', '--', '--hostname', '127.0.0.1', '--port', String(PORT)], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  server.stdout?.on('data', (chunk) => process.stdout.write(chunk));
  server.stderr?.on('data', (chunk) => process.stderr.write(chunk));
  await waitForServer(server);
  return server;
};

const stopServer = async (server: ChildProcess): Promise<void> => {
  if (server.exitCode !== null) return;
  server.kill('SIGTERM');
  await new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, 3000);
    server.once('exit', () => {
      clearTimeout(timeout);
      resolve();
    });
  });
  if (server.exitCode === null) {
    server.kill('SIGKILL');
  }
};

const createObservedPage = async (browser: Browser, viewport: ViewportCase) => {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    colorScheme: 'dark'
  });
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on('console', (message: ConsoleMessage) => {
    const text = message.text();
    if (message.type() === 'error' && !/Failed to load resource|favicon|ReactPlayer|media/i.test(text)) {
      consoleErrors.push(text);
    }
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  const isExpectedAbortedRequest = (url: string, errorText: string): boolean => {
    if (errorText !== 'net::ERR_ABORTED') return false;
    if (url.includes('/_next/static/')) return true;
    try {
      return new URL(url).searchParams.has('_rsc');
    } catch {
      return false;
    }
  };

  page.on('requestfailed', (request: Request) => {
    const url = request.url();
    if (!url.startsWith(BASE_URL)) return;
    const errorText = request.failure()?.errorText || 'failed';
    if (isExpectedAbortedRequest(url, errorText)) return;
    failedRequests.push(`${errorText} ${url}`);
  });
  page.on('response', (response) => {
    const url = response.url();
    const status = response.status();
    if (!url.startsWith(BASE_URL)) return;
    if (status >= 400 && !routes.some((route) => `${BASE_URL}${route.path}` === url && route.status === status)) {
      failedRequests.push(`${status} ${url}`);
    }
  });

  return { page, consoleErrors, pageErrors, failedRequests };
};

const assertNoBrowserErrors = (label: string, errors: { consoleErrors: string[]; pageErrors: string[]; failedRequests: string[] }) => {
  assert.deepEqual(errors.consoleErrors, [], `${label} emitted console errors.`);
  assert.deepEqual(errors.pageErrors, [], `${label} emitted page errors.`);
  assert.deepEqual(errors.failedRequests, [], `${label} had failed local requests.`);
};

const visitRoutes = async (browser: Browser, viewport: ViewportCase) => {
  const observed = await createObservedPage(browser, viewport);
  const { page } = observed;

  for (const route of routes) {
    const response = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
    assert.equal(response?.status(), route.status || 200, `${viewport.name} ${route.path} returned unexpected status.`);
    await page.waitForFunction((text) => document.body.innerText.includes(text), route.text, { timeout: 10000 });
    const bodyText = await page.locator('body').innerText();
    assert.ok(!/\b(?:undefined|NaN)\b/.test(bodyText), `${viewport.name} ${route.path} exposes invalid placeholder text.`);
    assert.ok(!/\b(?:nav|common|home|about|works|news|contact|footer|player)\.[A-Za-z0-9_.-]+/.test(bodyText), `${viewport.name} ${route.path} exposes raw translation keys.`);
  }

  assertNoBrowserErrors(`${viewport.name} route traversal`, observed);
  await page.close();
};

const exerciseMobileMenu = async (browser: Browser) => {
  const observed = await createObservedPage(browser, viewports[1]);
  const { page } = observed;
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '메뉴 열기' }).click();
  await page.getByRole('link', { name: '작품', exact: true }).click();
  await page.waitForURL(`${BASE_URL}/works`);
  await page.getByText('젠트리피케이션', { exact: false }).first().waitFor();
  const overflow = await page.evaluate(() => document.body.style.overflow);
  assert.equal(overflow, '', 'Mobile menu should restore body overflow after navigation.');
  assertNoBrowserErrors('mobile menu', observed);
  await page.close();
};

const exerciseLanguageToggle = async (browser: Browser) => {
  const observed = await createObservedPage(browser, viewports[0]);
  const { page } = observed;
  await page.goto(`${BASE_URL}/works/no-control`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '영어로 전환' }).click();
  await page.waitForURL(`${BASE_URL}/en/works/no-control`);
  await page.getByRole('button', { name: 'Switch to Korean' }).click();
  await page.waitForURL(`${BASE_URL}/works/no-control`);

  await page.goto(`${BASE_URL}/works?category=music&id=no-control`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '영어로 전환' }).click();
  await page.waitForURL(`${BASE_URL}/en/works?category=music&id=no-control`);
  await page.getByRole('button', { name: 'Switch to Korean' }).click();
  await page.waitForURL(`${BASE_URL}/works?category=music&id=no-control`);

  assertNoBrowserErrors('language toggle', observed);
  await page.close();
};

const exerciseWorksInteractions = async (browser: Browser) => {
  const observed = await createObservedPage(browser, viewports[0]);
  const { page } = observed;
  await page.goto(`${BASE_URL}/works?category=music&id=no-control`, { waitUntil: 'networkidle' });
  await page.locator('#work-no-control').waitFor({ timeout: 10000 });
  await expectPressed(page.getByRole('button', { name: '음악', exact: true }), true);

  await page.goto(`${BASE_URL}/works`, { waitUntil: 'networkidle' });
  await expectPressed(page.getByRole('button', { name: '전체', exact: true }), true);

  const search = page.getByRole('combobox', { name: /검색/ });
  await search.fill('No Control');
  await search.press('ArrowDown');
  await search.press('Enter');
  await page.locator('#work-no-control.ring-2').waitFor();

  await search.fill('젠트리피케이션');
  await search.press('ArrowDown');
  await search.press('Enter');
  await page.locator('#work-gentrification-2016.ring-2').waitFor();
  await expectClassAbsent(page.locator('#work-no-control'), 'ring-2');

  const playAll = page.getByRole('button', { name: /전체 재생/ });
  if (await playAll.count()) {
    await playAll.click();
    await page.getByRole('button', { name: /재생목록|Playlist/ }).waitFor();
    await page.getByRole('button', { name: /닫기|Close/ }).last().click();
  }

  assertNoBrowserErrors('works interactions', observed);
  await page.close();
};

const exerciseContactFallback = async (browser: Browser) => {
  const observed = await createObservedPage(browser, viewports[0]);
  const { page } = observed;
  await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle' });
  await page.getByText('문의 폼 설정이 아직 완료되지 않았습니다.', { exact: false }).waitFor();
  await expectDisabled(page.getByRole('button', { name: /메시지 보내기|Send Message/ }));
  assertNoBrowserErrors('contact fallback', observed);
  await page.close();
};

const expectDisabled = async (locator: ReturnType<Page['getByRole']>): Promise<void> => {
  const disabled = await locator.first().isDisabled();
  assert.equal(disabled, true, 'Expected control to be disabled.');
};

const expectPressed = async (locator: ReturnType<Page['getByRole']>, expected: boolean): Promise<void> => {
  const pressed = await locator.first().getAttribute('aria-pressed');
  assert.equal(pressed, String(expected), `Expected aria-pressed to be ${expected}.`);
};

const expectClassAbsent = async (locator: ReturnType<Page['locator']>, className: string): Promise<void> => {
  const classes = await locator.first().getAttribute('class');
  assert.ok(!classes?.split(/\s+/).includes(className), `Expected ${className} to be removed.`);
};

const main = async () => {
  const server = await startServer();
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch();
    for (const viewport of viewports) {
      await visitRoutes(browser, viewport);
    }
    await exerciseMobileMenu(browser);
    await exerciseLanguageToggle(browser);
    await exerciseWorksInteractions(browser);
    await exerciseContactFallback(browser);
  } finally {
    await browser?.close();
    await stopServer(server);
  }

  console.log('Browser smoke checks passed.');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
