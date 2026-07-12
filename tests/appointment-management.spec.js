const { test, expect } = require('@playwright/test');
const { createAppointment, login, nextValidBusinessDate, resetData } = require('./helpers/agendalab');

test.describe('RF005, RF006, RF007 e RF012 - Gestao de agendamentos', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await resetData(page);
  });

  test('cria agendamento confirmado e exibe dados na listagem e detalhes', async ({ page }) => {
    const appointment = await createAppointment(page, {
      customer: 'Cliente Listagem QA',
      date: nextValidBusinessDate(9),
      time: '09:00',
      notes: 'Validando detalhes do agendamento.',
    });

    await page.getByRole('link', { name: 'Meus Agendamentos' }).first().click();

    const card = page.locator('article').filter({ hasText: appointment.customer });
    await expect(card.getByText(appointment.service)).toBeVisible();
    await expect(card.getByText(appointment.professional)).toBeVisible();
    await expect(card.getByText(appointment.customer)).toBeVisible();
    await expect(card.getByText('CONFIRMADO')).toBeVisible();
    await expect(card.getByRole('button', { name: /Detalhes/i })).toBeVisible();
    await expect(card.getByRole('button', { name: /Reagendar/i })).toBeVisible();
    await expect(card.getByRole('button', { name: /Cancelar agendamento/i })).toBeVisible();

    await card.getByRole('button', { name: /Detalhes/i }).click();
    await expect(page.getByText(appointment.phone)).toBeVisible();
    await expect(page.getByText(appointment.notes)).toBeVisible();
  });

  test('recupera agendamento apos recarregar a pagina', async ({ page }) => {
    const appointment = await createAppointment(page, {
      customer: 'Cliente Persistencia QA',
      date: nextValidBusinessDate(10),
      time: '11:00',
    });

    await page.getByRole('link', { name: 'Meus Agendamentos' }).first().click();
    await page.reload();

    await expect(page.locator('article').filter({ hasText: appointment.customer })).toBeVisible();
  });

  test('filtra agendamentos por status, servico e profissional', async ({ page }) => {
    const appointment = await createAppointment(page, {
      customer: 'Cliente Filtro QA',
      date: nextValidBusinessDate(11),
      time: '13:00',
    });

    await page.getByRole('link', { name: 'Meus Agendamentos' }).first().click();
    await page.locator('#filter-status').selectOption('CONFIRMADO');
    await page.locator('#filter-service').selectOption({ label: appointment.service });
    await page.locator('#filter-professional').selectOption({ label: appointment.professional });

    await expect(page.locator('article').filter({ hasText: appointment.customer })).toBeVisible();

    await page.getByRole('button', { name: /Limpar/i }).click();
    await expect(page.locator('#filter-status')).toHaveValue('');
    await expect(page.locator('article').filter({ hasText: appointment.customer })).toBeVisible();
  });

  test('cancela agendamento confirmado e atualiza dashboard', async ({ page }) => {
    const appointment = await createAppointment(page, {
      customer: 'Cliente Cancelamento QA',
      date: nextValidBusinessDate(12),
      time: '14:00',
    });

    await page.getByRole('link', { name: 'Meus Agendamentos' }).first().click();
    page.once('dialog', async (dialog) => dialog.accept());
    await page
      .locator('article')
      .filter({ hasText: appointment.customer })
      .getByRole('button', { name: /Cancelar agendamento/i })
      .click();

    await page.locator('#filter-status').selectOption('CANCELADO');
    const canceledCard = page.locator('article').filter({ hasText: appointment.customer });

    await expect(canceledCard.getByText('CANCELADO')).toBeVisible();
    await expect(canceledCard.getByRole('button', { name: /Cancelar agendamento/i })).toHaveCount(0);

    await page.getByRole('link', { name: 'Dashboard' }).first().click();
    await expect(page.getByText(/Cancelados/i)).toBeVisible();
    await expect(page.locator('main').getByText('1')).toBeVisible();
  });
});
