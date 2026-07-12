const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

function nextValidBusinessDate(daysAhead = 7) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);

  while (date.getDay() === 0) {
    date.setDate(date.getDate() + 1);
  }

  return date.toISOString().slice(0, 10);
}

async function loginAsNormalUser(page) {
  await page.goto('/login');
  await page.locator('#username').fill('usuario_normal');
  await page.locator('#password').fill('secret123');
  await page.getByRole('button', { name: /^Entrar$/ }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: /Ola, Usuario Normal|Olá, Usuário Normal/i })).toBeVisible();
}

async function resetData(page) {
  await page.goto('/dashboard');
  page.once('dialog', async (dialog) => dialog.accept());
  await page.getByRole('button', { name: /Resetar Dados/i }).click();

  await expect(page.getByText(/Confirmados/i)).toBeVisible();
  await expect(page.locator('main').getByText('0')).toHaveCount(3);
}

async function fillValidAppointment(page, customer, overrides = {}) {
  const appointment = {
    customer,
    phone: '(11) 98888-7777',
    professional: 'Ana Souza',
    date: nextValidBusinessDate(),
    time: '10:00',
    notes: 'Cenario BDD executado com Cucumber e Playwright.',
    ...overrides,
  };

  await page.getByLabel(/Nome do cliente/i).fill(appointment.customer);
  await page.getByLabel(/Telefone/i).fill(appointment.phone);
  await page.getByLabel(/Servico|Serviço/i).selectOption({ index: 1 });
  await page.getByLabel(/Profissional/i).selectOption({ label: appointment.professional });
  await page.getByLabel(/Data/i).fill(appointment.date);
  await page.getByLabel(/Horario|Horário/i).selectOption({ label: appointment.time });
  await page.getByLabel(/Observacoes|Observações/i).fill(appointment.notes);

  return appointment;
}

Given('que acesso a pagina de login', async function () {
  await this.page.goto('/login');
});

Given('que estou autenticado como usuario normal', async function () {
  await loginAsNormalUser(this.page);
});

Given('os dados de teste foram resetados', async function () {
  await resetData(this.page);
});

Given('que existe um agendamento confirmado para {string}', async function (customer) {
  await this.page.goto('/new-appointment');
  this.appointment = await fillValidAppointment(this.page, customer);
  await this.page.getByRole('button', { name: /Confirmar Agendamento/i }).click();
  await expect(this.page.getByText(/agendamento.*sucesso|criado.*sucesso/i)).toBeVisible();
});

When('tento acessar o dashboard sem estar autenticado', async function () {
  await this.page.goto('/dashboard');
});

When('informo credenciais validas do usuario normal', async function () {
  await this.page.locator('#username').fill('usuario_normal');
  await this.page.locator('#password').fill('secret123');
  await this.page.getByRole('button', { name: /^Entrar$/ }).click();
});

When('informo credenciais do usuario bloqueado', async function () {
  await this.page.getByRole('button', { name: /usuario_bloqueado/i }).click();
  await this.page.getByRole('button', { name: /^Entrar$/ }).click();
});

When('acesso a pagina de novo agendamento', async function () {
  await this.page.goto('/new-appointment');
});

When('acesso a pagina Meus Agendamentos', async function () {
  await this.page.goto('/my-appointments');
});

When('preencho um agendamento valido para {string}', async function (customer) {
  this.appointment = await fillValidAppointment(this.page, customer);
});

When('preencho um agendamento com telefone invalido para {string}', async function (customer) {
  this.appointment = await fillValidAppointment(this.page, customer, {
    phone: 'telefone-abc',
  });
});

When('confirmo o agendamento', async function () {
  await this.page.getByRole('button', { name: /Confirmar Agendamento/i }).click();
});

When('cancelo o agendamento {string}', async function (customer) {
  pageOnceDialogAccept(this.page);

  await this.page
    .locator('article')
    .filter({ hasText: customer })
    .getByRole('button', { name: /Cancelar agendamento/i })
    .click();
});

Then('devo ser redirecionado para a pagina de login', async function () {
  await expect(this.page).toHaveURL(/\/login$/);
  await expect(this.page.getByRole('heading', { name: /Entrar na plataforma/i })).toBeVisible();
});

Then('devo visualizar o dashboard do usuario normal', async function () {
  await expect(this.page).toHaveURL(/\/dashboard$/);
  await expect(this.page.getByRole('heading', { name: /Ola, Usuario Normal|Olá, Usuário Normal/i })).toBeVisible();
});

Then('devo ver a mensagem de acesso bloqueado', async function () {
  await expect(this.page.getByText(/Acesso bloqueado\. Entre em contato/i)).toBeVisible();
  await expect(this.page).toHaveURL(/\/login$/);
});

Then('devo ver mensagem de sucesso do agendamento', async function () {
  await expect(this.page.getByText(/agendamento.*sucesso|criado.*sucesso/i)).toBeVisible();
});

Then('devo continuar na pagina de novo agendamento', async function () {
  await expect(this.page).toHaveURL(/\/new-appointment/);
});

Then('devo ver uma mensagem de erro sobre telefone', async function () {
  await expect(this.page.getByText(/telefone|digitos|dígitos|numeros|números/i).first()).toBeVisible();
});

Then('o agendamento {string} deve aparecer em Meus Agendamentos com status {string}', async function (customer, status) {
  await this.page.goto('/my-appointments');

  const appointmentCard = this.page.locator('article').filter({ hasText: customer });
  await expect(appointmentCard.getByText(customer)).toBeVisible();
  await expect(appointmentCard.getByText(status)).toBeVisible();
});

Then('o agendamento {string} deve aparecer com status {string}', async function (customer, status) {
  await this.page.locator('#filter-status').selectOption(status);

  const appointmentCard = this.page.locator('article').filter({ hasText: customer });
  await expect(appointmentCard.getByText(status)).toBeVisible();
});

Then('o dashboard deve exibir {int} agendamento cancelado', async function (quantity) {
  await this.page.goto('/dashboard');

  await expect(this.page.getByText(/Cancelados/i)).toBeVisible();
  await expect(this.page.locator('main').getByText(String(quantity))).toBeVisible();
});

function pageOnceDialogAccept(page) {
  page.once('dialog', async (dialog) => dialog.accept());
}
