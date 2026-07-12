const { test, expect } = require('@playwright/test');

const user = {
  name: 'usuario_normal',
  password: 'secret123',
  displayName: 'Usuário Normal',
};

function nextBusinessDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);

  while (date.getDay() === 0) {
    date.setDate(date.getDate() + 1);
  }

  return date.toISOString().slice(0, 10);
}

async function login(page) {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel('Usuário').fill(user.name);
  await page.locator('#password').fill(user.password);
  await page.getByRole('button', { name: /^Entrar$/ }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: new RegExp(`Olá, ${user.displayName}`) })).toBeVisible();
}

async function resetTestData(page) {
  page.once('dialog', async (dialog) => dialog.accept());
  await page.getByRole('button', { name: /Resetar Dados/i }).click();
  await expect(page.getByText('Confirmados')).toBeVisible();
  await expect(page.getByText('Concluídos')).toBeVisible();
  await expect(page.getByText('Cancelados')).toBeVisible();
  await expect(page.locator('main').getByText('0')).toHaveCount(3);
}

test.describe('AgendaLab QA - jornada de agendamento', () => {
  test('valida requisitos e executa fluxo completo de criar, listar, filtrar e cancelar agendamento', async ({ page }) => {
    const appointment = {
      customer: 'Cliente Portfolio QA',
      phone: '(11) 98888-7777',
      service: 'Consulta inicial',
      professional: 'Ana Souza',
      date: nextBusinessDate(),
      time: '10:00',
      notes: 'Cenário E2E criado com Playwright para portfolio.',
    };

    await login(page);
    await resetTestData(page);

    // RF009: requisitos disponíveis e documentados para orientar os cenários de teste.
    await page.getByRole('link', { name: 'Requisitos do Sistema' }).first().click();
    await expect(page).toHaveURL(/\/requirements$/);
    await expect(page.getByRole('heading', { name: 'Requisitos do Sistema' })).toBeVisible();

    const expectedRequirements = [
      'RF001 Autenticação de Usuários',
      'RF002 Dashboard',
      'RF003 Catálogo de Serviços',
      'RF004 Novo Agendamento',
      'RF005 Listagem de Meus Agendamentos',
      'RF006 Filtros de Agendamentos',
      'RF007 Cancelamento de Agendamento',
      'RF008 Reagendamento',
      'RF009 Página de Requisitos do Sistema',
      'RF010 Navegação e Layout',
      'RF011 Reset de Dados de Teste',
      'RF012 Persistência de Dados',
      'RF013 Validação de Disponibilidade de Horário',
      'RF014 Acessibilidade e Responsividade',
    ];

    for (const requirement of expectedRequirements) {
      await expect(page.getByRole('button', { name: requirement })).toBeVisible();
    }

    // RF003: catálogo apresenta serviços e permite iniciar um agendamento.
    await page.getByRole('link', { name: 'Serviços' }).first().click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(page.getByRole('heading', { name: 'Catálogo de Serviços' })).toBeVisible();
    await expect(page.getByRole('heading', { name: appointment.service })).toBeVisible();
    await page
      .locator('article, div')
      .filter({ has: page.getByRole('heading', { name: appointment.service }) })
      .getByRole('button', { name: 'Agendar' })
      .first()
      .click();

    // RF004: criação de agendamento com dados válidos.
    await expect(page).toHaveURL(/\/new-appointment/);
    await page.getByLabel(/Nome do cliente/i).fill(appointment.customer);
    await page.getByLabel(/Telefone/i).fill(appointment.phone);
    await page.getByLabel(/Serviço/i).selectOption({ index: 1 });
    await page.getByLabel(/Profissional/i).selectOption({ label: appointment.professional });
    await page.getByLabel(/Data/i).fill(appointment.date);
    await page.getByLabel(/Horário/i).selectOption({ label: appointment.time });
    await page.getByLabel(/Observações/i).fill(appointment.notes);
    await page.getByRole('button', { name: /Confirmar Agendamento/i }).click();

    await expect(page.getByText(/agendamento.*sucesso|criado.*sucesso/i)).toBeVisible();
    await page.getByRole('link', { name: 'Meus Agendamentos' }).first().click();
    await expect(page).toHaveURL(/\/my-appointments$/);

    // RF005/RF012: listagem recupera os dados persistidos no navegador.
    const appointmentCard = page.locator('article').filter({ hasText: appointment.customer });
    await expect(appointmentCard.getByText(appointment.customer)).toBeVisible();
    await expect(appointmentCard.getByText(appointment.professional)).toBeVisible();
    await expect(appointmentCard.getByText('CONFIRMADO')).toBeVisible();

    await page
      .locator('article')
      .filter({ hasText: appointment.customer })
      .getByRole('button', { name: /Detalhes/i })
      .click();
    await expect(page.getByText(appointment.phone)).toBeVisible();
    await expect(page.getByText(appointment.notes)).toBeVisible();
    await page.keyboard.press('Escape');

    await page.reload();
    await expect(page.getByText(appointment.customer)).toBeVisible();

    // RF006: filtros por status e profissional preservam o agendamento correto.
    await page.locator('#filter-status').selectOption('CONFIRMADO');
    await page.locator('#filter-professional').selectOption({ label: appointment.professional });
    await expect(page.getByText(appointment.customer)).toBeVisible();

    // RF007: cancelamento de agendamento confirmado.
    page.once('dialog', async (dialog) => dialog.accept());
    await page
      .locator('article')
      .filter({ hasText: appointment.customer })
      .getByRole('button', { name: /Cancelar agendamento/i })
      .click();

    await page.locator('#filter-status').selectOption('CANCELADO');
    const canceledAppointmentCard = page.locator('article').filter({ hasText: appointment.customer });
    await expect(canceledAppointmentCard.getByText('CANCELADO')).toBeVisible();
    await expect(canceledAppointmentCard.getByRole('button', { name: /Cancelar agendamento/i })).toHaveCount(0);

    // RF002: dashboard reflete resumo após cancelamento.
    await page.getByRole('link', { name: 'Dashboard' }).first().click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText('Cancelados')).toBeVisible();
    await expect(page.locator('main').getByText('1')).toBeVisible();

    // RF001: logout encerra sessão e protege páginas internas.
    await page.getByRole('button', { name: 'Sair' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
  });
});
