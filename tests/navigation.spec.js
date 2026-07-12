const { test, expect } = require('@playwright/test');
const { login } = require('./helpers/agendalab');

test.describe('RF010 e RF014 - Navegacao e responsividade', () => {
  test('menu autenticado navega para todas as paginas principais', async ({ page }) => {
    await login(page);

    const links = [
      ['Dashboard', /\/dashboard$/],
      ['Serviços', /\/services$/],
      ['Novo Agendamento', /\/new-appointment$/],
      ['Meus Agendamentos', /\/my-appointments$/],
      ['Requisitos do Sistema', /\/requirements$/],
    ];

    for (const [name, url] of links) {
      await page.getByRole('link', { name }).first().click();
      await expect(page).toHaveURL(url);
    }
  });

  test('exibe pagina 404 com retorno para dashboard em rota inexistente', async ({ page }) => {
    await login(page);
    await page.goto('/rota-inexistente-portfolio');

    await expect(page.getByRole('heading', { name: /pagina nao encontrada|página não encontrada/i })).toBeVisible();
    await page.getByRole('button', { name: /Voltar ao Dashboard/i }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('menu mobile abre e permite navegar por teclado/click em largura pequena', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await login(page);

    await page.getByRole('button', { name: /Abrir menu/i }).click();
    await expect(page.getByRole('button', { name: /Fechar menu/i })).toBeVisible();

    await page.getByRole('link', { name: 'Serviços' }).first().click();
    await expect(page).toHaveURL(/\/services$/);
  });
});
