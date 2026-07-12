# AgendaLab QA - Testes E2E com Playwright

Projeto de portfolio com um caso de teste ponta a ponta para o site AgendaLab QA:

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

## Como executar

```bash
npm install
npm run install:browsers
npm run test:e2e
```

Para abrir o relatorio HTML apos a execucao:

```bash
npm run report
```

## Observacoes de QA

- A tela de login informa `SENHA: SECRET123`, mas os botoes de usuario preenchem `secret123`. O teste usa a senha real aceita pela aplicacao.
- O teste faz reset dos dados no inicio para manter o cenario independente.
- As evidencias de exploracao ficam em `artifacts/requirements.json` e `artifacts/site-map.json`.
