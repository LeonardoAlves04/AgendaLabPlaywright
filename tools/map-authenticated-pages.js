const { chromium } = require('@playwright/test');

const baseUrl = process.env.BASE_URL || 'https://agendalabqa.vercel.app';
const routes = ['/dashboard', '/requirements', '/services', '/new-appointment', '/my-appointments'];

async function login(page) {
  await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /usuario_normal/i }).click();
  await page.getByRole('button', { name: /^Entrar$/ }).click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
}

async function pageSnapshot(page, route) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  return page.evaluate(() => {
    const compact = (value) => value?.replace(/\s+/g, ' ').trim();
    const headings = [...document.querySelectorAll('h1,h2,h3,h4')].map((element) => compact(element.innerText)).filter(Boolean);
    const controls = [...document.querySelectorAll('a,button,input,select,textarea')]
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        text: compact(element.innerText) || element.getAttribute('aria-label') || element.getAttribute('placeholder') || '',
        role: element.getAttribute('role') || '',
        type: element.getAttribute('type') || '',
        href: element.href || '',
      }))
      .filter((item) => item.text || item.href || item.type || item.role);
    return {
      url: location.href,
      headings,
      controls,
      text: compact(document.body.innerText),
    };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await login(page);

  const snapshots = {};
  for (const route of routes) {
    snapshots[route] = await pageSnapshot(page, route);
    await page.screenshot({ path: `artifacts/${route.replace('/', '') || 'home'}.png`, fullPage: true });
  }

  console.log(JSON.stringify(snapshots, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
