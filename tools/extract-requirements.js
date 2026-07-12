const { chromium } = require('@playwright/test');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://agendalabqa.vercel.app/login', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /usuario_normal/i }).click();
  await page.getByRole('button', { name: /^Entrar$/ }).click();
  await page.waitForURL('**/dashboard');
  await page.goto('https://agendalabqa.vercel.app/requirements', { waitUntil: 'networkidle' });

  const buttons = await page.locator('button').filter({ hasText: /^RF\d{3}/ }).all();
  const requirements = [];

  for (const button of buttons) {
    const title = (await button.innerText()).replace(/\s+/g, ' ').trim();
    await button.click();
    await page.waitForTimeout(150);
    const sectionText = await button.evaluate((element) => {
      const parent = element.closest('div');
      return parent?.innerText?.replace(/\s+/g, ' ').trim();
    });
    requirements.push({ title, details: sectionText });
  }

  console.log(JSON.stringify(requirements, null, 2));
  await page.screenshot({ path: 'artifacts/requirements-expanded.png', fullPage: true });
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
