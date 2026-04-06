const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('console', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('pageerror', err.message));
  page.on('requestfailed', req => console.log('requestfailed', req.url(), req.failure().errorText));
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const html = await page.content();
  console.log('page title:', await page.title());
  console.log('current url:', page.url());
  console.log('root html snapshot', html.slice(0, 1200));
  await browser.close();
})();