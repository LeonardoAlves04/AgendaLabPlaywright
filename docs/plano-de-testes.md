# Plano de Testes - AgendaLab QA

## Objetivo

Validar os principais requisitos funcionais da plataforma AgendaLab QA por meio de testes E2E automatizados com Playwright e cenarios BDD com Cucumber/Gherkin.

## Escopo

- Autenticacao e protecao de rotas.
- Dashboard com resumo de agendamentos.
- Catalogo de servicos.
- Criacao de novo agendamento.
- Validacoes de formulario.
- Persistencia de dados no navegador.
- Filtros de agendamento.
- Cancelamento de agendamento.
- Reagendamento.
- Validacao de disponibilidade de horario.
- Requisitos do sistema.
- Navegacao, 404 e responsividade basica.

## Fora de Escopo

- Testes de API, pois a aplicacao utiliza dados no navegador.
- Testes de performance/carga.
- Testes visuais pixel a pixel.
- Validacao completa de acessibilidade com ferramentas dedicadas.

## Tipos de Teste

- **Smoke:** cenarios essenciais para confirmar que a aplicacao esta utilizavel.
- **Regressao:** cobertura dos fluxos principais e regras de negocio.
- **Negativos:** validacoes de erro e bloqueios esperados.
- **BDD:** cenarios em linguagem de negocio para documentar comportamento.

## Massa de Dados

- Usuario normal: `usuario_normal`.
- Usuario bloqueado: `usuario_bloqueado`.
- Senha utilizada pela aplicacao: `secret123`.
- Servico base: `Consulta inicial`.
- Profissional base: `Ana Souza`.
- Datas geradas dinamicamente para evitar domingos e datas passadas.
- Reset de dados executado antes dos fluxos que dependem de estado limpo.

## Riscos e Observacoes

- A tela informa `SECRET123`, mas a senha funcional preenchida pelos botoes e aceita pela aplicacao e `secret123`.
- Como os dados ficam no `localStorage`, os testes precisam resetar o estado antes de cenarios criticos.
- Horarios ocupados deixam de aparecer como opcoes validas para novo agendamento.
- Alguns textos podem variar com acentuacao; os testes usam expressoes regulares para reduzir fragilidade.

## Criterios de Aceite da Automacao

- Todos os cenarios Playwright devem passar em Chromium.
- Todos os cenarios BDD devem passar sem passos pendentes.
- Relatorios devem ser gerados apos execucao.
- Cenarios devem ter nomes claros e rastreaveis aos requisitos funcionais.

## Comandos

```bash
npm run test:e2e
npm run test:headed
npm run test:bdd
npm run test:bdd:headed
npm run test:bdd:smoke
npm run test:bdd:regression
```

## Evidencias

- `playwright-report/`: relatorio HTML da suite Playwright.
- `cucumber-report.html`: relatorio HTML da suite BDD.
- `artifacts/requirements.json`: requisitos extraidos da aplicacao.
- `artifacts/site-map.json`: mapeamento exploratorio das paginas autenticadas.
