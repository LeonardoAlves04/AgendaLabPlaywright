const { chromium } = require('@playwright/test');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const responses = [];

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/_next/static/') && url.endsWith('.js')) {
      responses.push(url);
    }
  });

  await page.goto('https://agendalabqa.vercel.app/login', { waitUntil: 'networkidle' });

  console.log('Inputs:', await page.locator('input').evaluateAll((inputs) =>
    inputs.map((input) => ({
      type: input.type,
      name: input.name,
      id: input.id,
      value: input.value,
      placeholder: input.placeholder,
      autocomplete: input.autocomplete,
    })),
  ));

  await page.getByRole('button', { name: /usuario_normal/i }).click();
  console.log('After quick user:', await page.locator('input').evaluateAll((inputs) =>
    inputs.map((input) => ({
      type: input.type,
      name: input.name,
      id: input.id,
      value: input.value,
      placeholder: input.placeholder,
    })),
  ));

  console.log('Scripts:', [...new Set(responses)]);
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
