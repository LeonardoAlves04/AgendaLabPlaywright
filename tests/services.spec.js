const { test, expect } = require('@playwright/test');
const { login } = require('./helpers/agendalab');

test.describe('RF003 - Catalogo de servicos', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/services');
  });

  test('exibe os seis servicos cadastrados com categorias principais', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Catalogo de Servicos|Catálogo de Serviços/i })).toBeVisible();

    const services = [
      'Consulta inicial',
      'Avaliacao postural|Avaliação postural',
      'Aula experimental',
      'Treino funcional',
      'Massagem relaxante',
      'Sessao de alongamento|Sessão de alongamento',
    ];

    for (const service of services) {
      await expect(page.getByRole('heading', { name: new RegExp(service) })).toBeVisible();
    }

    for (const category of ['Saude|Saúde', 'Educacao|Educação', 'Esporte', 'Bem-estar']) {
      await expect(page.getByText(new RegExp(category)).first()).toBeVisible();
    }

    await expect(page.getByRole('button', { name: 'Agendar' })).toHaveCount(6);
  });

  test('inicia novo agendamento a partir de um servico do catalogo', async ({ page }) => {
    await page
      .locator('article, div')
      .filter({ has: page.getByRole('heading', { name: 'Consulta inicial' }) })
      .getByRole('button', { name: 'Agendar' })
      .first()
      .click();

    await expect(page).toHaveURL(/\/new-appointment\?serviceId=svc-001/);
    await expect(page.getByRole('heading', { name: /Novo Agendamento/i })).toBeVisible();
    await expect(page.getByLabel(/Servico|Serviço/i)).toHaveValue('svc-001');
  });
});
