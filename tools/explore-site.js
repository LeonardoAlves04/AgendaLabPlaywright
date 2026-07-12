const { chromium } = require('@playwright/test');

const baseUrl = process.env.BASE_URL || 'https://agendalabqa.vercel.app';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', (message) => {
    if (message.type() === 'error') {
      console.log(`[console:${message.type()}] ${message.text()}`);
    }
  });

  page.on('pageerror', (error) => console.log(`[pageerror] ${error.message}`));

  await page.goto(`${baseUrl}/dashboard`, {
    waitUntil: 'domcontentloaded',
    timeout: 45000,
  });

  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

  if (page.url().includes('/login')) {
    await page.getByRole('button', { name: /usuario_normal/i }).click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /^Entrar$/ }).click();
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  }

  const snapshot = await page.evaluate(() => {
    const visibleText = (element) =>
      element.innerText
        ?.replace(/\s+/g, ' ')
        .trim();

    const text = visibleText(document.body);
    const headings = [...document.querySelectorAll('h1,h2,h3,h4')]
      .map((element) => visibleText(element))
      .filter(Boolean);

    const controls = [...document.querySelectorAll('a,button,input,select,textarea')]
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        text:
          visibleText(element) ||
          element.getAttribute('aria-label') ||
          element.getAttribute('placeholder') ||
          element.getAttribute('name') ||
          '',
        href: element.href || '',
        type: element.getAttribute('type') || '',
      }))
      .filter((item) => item.text || item.href || item.type);

    return {
      url: location.href,
      title: document.title,
      headings,
      controls,
      text,
    };
  });

  console.log(JSON.stringify(snapshot, null, 2));
  await page.screenshot({ path: 'artifacts/dashboard.png', fullPage: true });
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
