# language: pt
Funcionalidade: Cancelamento de agendamento
  Como usuario autenticado
  Quero cancelar um agendamento confirmado
  Para liberar um horario que nao vou mais utilizar

  Contexto:
    Dado que estou autenticado como usuario normal
    E os dados de teste foram resetados

  Cenario: Cancelar agendamento confirmado
    Dado que existe um agendamento confirmado para "Cliente Cancelamento BDD"
    Quando acesso a pagina Meus Agendamentos
    E cancelo o agendamento "Cliente Cancelamento BDD"
    Entao o agendamento "Cliente Cancelamento BDD" deve aparecer com status "CANCELADO"
    E o dashboard deve exibir 1 agendamento cancelado
