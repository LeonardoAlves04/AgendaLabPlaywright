# language: pt
@appointment @reschedule @regression
Funcionalidade: Reagendamento
  Como usuario autenticado
  Quero alterar a data e o horario de um agendamento confirmado
  Para manter minha reserva em um horario mais adequado

  Contexto:
    Dado que estou autenticado como usuario normal
    E os dados de teste foram resetados

  @business-rule
  Cenario: Reagendar um agendamento confirmado
    Dado que existe um agendamento confirmado para "Cliente Reagendamento BDD" as "09:00"
    Quando acesso a pagina Meus Agendamentos
    E reagendo o agendamento "Cliente Reagendamento BDD" para um novo horario
    Entao o agendamento "Cliente Reagendamento BDD" deve exibir a nova data e horario
