const { expect } = require('@playwright/test');

const testUser = {
  username: 'usuario_normal',
  password: 'secret123',
  displayName: 'Usuario Normal',
};

function formatIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function nextValidBusinessDate(daysAhead = 7) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);

  while (date.getDay() === 0) {
    date.setDate(date.getDate() + 1);
  }

  return formatIsoDate(date);
}

function pastDate() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return formatIsoDate(date);
}

function nextSunday() {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  while (date.getDay() !== 0) {
    date.setDate(date.getDate() + 1);
  }

  return formatIsoDate(date);
}

async function login(page, user = testUser) {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login$/);

  await page.locator('#username').fill(user.username);
  await page.locator('#password').fill(user.password);
  await page.getByRole('button', { name: /^Entrar$/ }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: /Ola, Usuario Normal|Olá, Usuário Normal/ })).toBeVisible();
}

async function resetData(page) {
  await page.goto('/dashboard');
  page.once('dialog', async (dialog) => dialog.accept());
  await page.getByRole('button', { name: /Resetar Dados/i }).click();

  await expect(page.getByText(/Confirmados/i)).toBeVisible();
  await expect(page.getByText(/Concluidos|Concluídos/i)).toBeVisible();
  await expect(page.getByText(/Cancelados/i)).toBeVisible();
  await expect(page.locator('main').getByText('0')).toHaveCount(3);
}

async function fillAppointmentForm(page, appointment) {
  await page.getByLabel(/Nome do cliente/i).fill(appointment.customer);
  await page.getByLabel(/Telefone/i).fill(appointment.phone);
  await page.getByLabel(/Servico|Serviço/i).selectOption({ index: appointment.serviceIndex ?? 1 });
  await page.getByLabel(/Profissional/i).selectOption({ label: appointment.professional });
  await page.getByLabel(/Data/i).fill(appointment.date);
  await page.getByLabel(/Horario|Horário/i).selectOption({ label: appointment.time });

  if (appointment.notes) {
    await page.getByLabel(/Observacoes|Observações/i).fill(appointment.notes);
  }
}

async function createAppointment(page, overrides = {}) {
  const appointment = {
    customer: 'Cliente Portfolio QA',
    phone: '(11) 98888-7777',
    service: 'Consulta inicial',
    serviceIndex: 1,
    professional: 'Ana Souza',
    date: nextValidBusinessDate(),
    time: '10:00',
    notes: 'Cenario E2E criado com Playwright para portfolio.',
    ...overrides,
  };

  await page.goto('/new-appointment');
  await fillAppointmentForm(page, appointment);
  await page.getByRole('button', { name: /Confirmar Agendamento/i }).click();
  await expect(page.getByText(/agendamento.*sucesso|criado.*sucesso/i)).toBeVisible();

  return appointment;
}

module.exports = {
  createAppointment,
  fillAppointmentForm,
  login,
  nextSunday,
  nextValidBusinessDate,
  pastDate,
  resetData,
  testUser,
};
