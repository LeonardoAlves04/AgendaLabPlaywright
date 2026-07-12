const { test, expect } = require('@playwright/test');
const { login, testUser } = require('./helpers/agendalab');

test.describe('RF001 - Autenticacao de usuarios', () => {
  test('redireciona pagina protegida para login quando nao existe sessao', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: /Entrar na plataforma/i })).toBeVisible();
  });

  test('mantem login bloqueado quando campos obrigatorios estao vazios', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /^Entrar$/ }).click();

    await expect(page.locator('#username')).toHaveAttribute('aria-required', 'true');
    await expect(page.locator('#password')).toHaveAttribute('aria-required', 'true');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('exibe erro generico para credenciais invalidas', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#username').fill('usuario_inexistente');
    await page.locator('#password').fill('senha_incorreta');
    await page.getByRole('button', { name: /^Entrar$/ }).click();

    await expect(page.getByText(/usuario ou senha invalidos|usuário ou senha inválidos/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('bloqueia usuario com status bloqueado', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /usuario_bloqueado/i }).click();
    await page.getByRole('button', { name: /^Entrar$/ }).click();

    await expect(page.getByText(/Acesso bloqueado\. Entre em contato/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('mantem sessao ao recarregar e remove sessao ao sair', async ({ page }) => {
    await login(page);

    await page.reload();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText(/Usuario Normal|Usuário Normal/).first()).toBeVisible();

    await page.getByRole('button', { name: /Sair/i }).click();
    await expect(page).toHaveURL(/\/login$/);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
  });
});
