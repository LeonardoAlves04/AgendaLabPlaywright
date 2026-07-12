const { test, expect } = require('@playwright/test');
const {
  fillAppointmentForm,
  login,
  nextSunday,
  nextValidBusinessDate,
  pastDate,
  resetData,
} = require('./helpers/agendalab');

test.describe('RF004 - Validacoes do novo agendamento', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await resetData(page);
    await page.goto('/new-appointment');
  });

  test('impede envio com campos obrigatorios vazios', async ({ page }) => {
    await page.getByRole('button', { name: /Confirmar Agendamento/i }).click();

    await expect(page.getByText(/obrigatorio|obrigatorios|required|preencha/i).first()).toBeVisible();
    await expect(page).toHaveURL(/\/new-appointment/);
  });

  test('rejeita telefone com caracteres invalidos', async ({ page }) => {
    await fillAppointmentForm(page, {
      customer: 'Cliente Telefone Invalido',
      phone: 'telefone-abc',
      professional: 'Ana Souza',
      date: nextValidBusinessDate(8),
      time: '09:00',
    });

    await page.getByRole('button', { name: /Confirmar Agendamento/i }).click();

    await expect(page.getByText(/telefone|digitos|dígitos|numeros|números/i).first()).toBeVisible();
    await expect(page).toHaveURL(/\/new-appointment/);
  });

  test('rejeita data passada', async ({ page }) => {
    await fillAppointmentForm(page, {
      customer: 'Cliente Data Passada',
      phone: '(11) 97777-1111',
      professional: 'Ana Souza',
      date: pastDate(),
      time: '09:00',
    });

    await page.getByRole('button', { name: /Confirmar Agendamento/i }).click();

    await expect(page.getByText(/data passada|futura|anterior|invalida|inválida/i).first()).toBeVisible();
    await expect(page).toHaveURL(/\/new-appointment/);
  });

  test('rejeita domingo como data de agendamento', async ({ page }) => {
    await fillAppointmentForm(page, {
      customer: 'Cliente Domingo',
      phone: '(11) 96666-2222',
      professional: 'Ana Souza',
      date: nextSunday(),
      time: '09:00',
    });

    await page.getByRole('button', { name: /Confirmar Agendamento/i }).click();

    await expect(page.getByText(/domingo|segunda a sabado|segunda a sábado/i).first()).toBeVisible();
    await expect(page).toHaveURL(/\/new-appointment/);
  });

  test('limita observacoes a 200 caracteres', async ({ page }) => {
    const notes = 'A'.repeat(250);
    await page.getByLabel(/Observacoes|Observações/i).fill(notes);

    await expect(page.getByLabel(/Observacoes|Observações/i)).toHaveValue('A'.repeat(200));
    await expect(page.getByText('200/200')).toBeVisible();
  });
});
