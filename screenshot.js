const { chromium } = require('playwright');

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/home');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of just the header area
  const header = await page.locator('header').first();
  await header.screenshot({ path: '/tmp/header_screenshot.png' });
  
  // Also take full page screenshot for context
  await page.screenshot({ path: '/tmp/full_page_screenshot.png' });
  
  await browser.close();
}

takeScreenshot().catch(console.error);