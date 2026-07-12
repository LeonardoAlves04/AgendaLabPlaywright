const { test, expect } = require('@playwright/test');
const { login } = require('./helpers/agendalab');

const requirements = [
  'RF001',
  'RF002',
  'RF003',
  'RF004',
  'RF005',
  'RF006',
  'RF007',
  'RF008',
  'RF009',
  'RF010',
  'RF011',
  'RF012',
  'RF013',
  'RF014',
];

test.describe('RF009 - Pagina de requisitos do sistema', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/requirements');
  });

  test('lista todos os requisitos funcionais documentados', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Requisitos do Sistema/i })).toBeVisible();

    for (const requirement of requirements) {
      await expect(page.getByRole('button', { name: new RegExp(requirement) })).toBeVisible();
    }
  });

  test('exibe criterios de aceitacao ao expandir cada requisito', async ({ page }) => {
    for (const requirement of requirements) {
      const item = page.getByRole('button', { name: new RegExp(requirement) });
      await item.click();

      await expect(page.getByText(/criterios de aceitacao|critérios de aceitação/i).first()).toBeVisible();
      await expect(page.locator('main').getByText(requirement)).toBeVisible();
    }
  });
});
