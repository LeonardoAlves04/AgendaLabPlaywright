# AgendaLab QA - Automacao E2E com Playwright e BDD

Projeto de portfolio com automacao E2E em Playwright e documentacao viva em BDD/Gherkin, baseado nos requisitos funcionais reais do site AgendaLab QA:

https://agendalabqa.vercel.app

## Objetivo

Validar a jornada principal de um usuario autenticado, partindo dos requisitos funcionais documentados na propria aplicacao.

Os cenarios automatizados cobrem:

- login e protecao de rotas;
- credenciais invalidas e usuario bloqueado;
- leitura da pagina "Requisitos do Sistema";
- catalogo de servicos;
- criacao de novo agendamento;
- validacoes de campos obrigatorios, telefone, data passada, domingo e limite de observacoes;
- persistencia em `localStorage`;
- listagem e filtros de agendamentos;
- cancelamento de agendamento;
- resumo do dashboard;
- logout;
- rota 404;
- menu mobile.

## Suite atual

- `auth.spec.js`: autenticacao, sessao, logout e usuario bloqueado.
- `requirements.spec.js`: requisitos funcionais RF001 a RF014.
- `services.spec.js`: catalogo e inicio de agendamento pelo servico.
- `appointment-validations.spec.js`: validacoes do formulario.
- `appointment-management.spec.js`: criacao, detalhes, filtros, persistencia e cancelamento.
- `navigation.spec.js`: menu, 404 e responsividade.
- `agendamento.e2e.spec.js`: jornada ponta a ponta completa.

## Suite BDD/Gherkin

Tambem existe uma camada BDD com Cucumber + Playwright:

- `features/autenticacao.feature`: acesso protegido, login valido e usuario bloqueado.
- `features/agendamento.feature`: criacao de agendamento, validacao de telefone e conflito de horario.
- `features/cancelamento.feature`: cancelamento de agendamento confirmado.
- `features/reagendamento.feature`: alteracao de data e horario de agendamento confirmado.
- `features/step-definitions/agendalab.steps.js`: steps que executam as acoes no navegador.
- `features/support/world.js`: configuracao do navegador para cada cenario.

Os cenarios BDD usam tags como `@smoke`, `@regression`, `@auth`, `@appointment`, `@negative` e `@business-rule`.

## Documentacao de QA

- `docs/plano-de-testes.md`: estrategia, escopo, riscos, massa de dados, criterios de aceite e evidencias.

## Como executar

```bash
npm install
npm run install:browsers
npm run test:e2e
```

Para executar os cenarios BDD:

```bash
npm run test:bdd
```

Para executar por tag:

```bash
npm run test:bdd:smoke
npm run test:bdd:regression
npm run test:bdd -- --tags "@business-rule"
```

Para executar os cenarios BDD com o navegador aberto:

```bash
npm run test:bdd:headed
```

Para abrir o relatorio HTML apos a execucao:

```bash
npm run report
```

## Observacoes de QA

- A tela de login informa `SENHA: SECRET123`, mas os botoes de usuario preenchem `secret123`. O teste usa a senha real aceita pela aplicacao.
- O teste faz reset dos dados no inicio para manter o cenario independente.
- As evidencias de exploracao ficam em `artifacts/requirements.json` e `artifacts/site-map.json`.
