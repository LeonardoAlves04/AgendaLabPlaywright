# language: pt
Funcionalidade: Novo agendamento
  Como usuario autenticado
  Quero criar um agendamento de servico
  Para reservar um horario com um profissional disponivel

  Contexto:
    Dado que estou autenticado como usuario normal
    E os dados de teste foram resetados

  Cenario: Criar agendamento com dados validos
    Quando acesso a pagina de novo agendamento
    E preencho um agendamento valido para "Cliente BDD QA"
    E confirmo o agendamento
    Entao devo ver mensagem de sucesso do agendamento
    E o agendamento "Cliente BDD QA" deve aparecer em Meus Agendamentos com status "CONFIRMADO"

  Cenario: Rejeitar agendamento com telefone invalido
    Quando acesso a pagina de novo agendamento
    E preencho um agendamento com telefone invalido para "Cliente Telefone BDD"
    E confirmo o agendamento
    Entao devo continuar na pagina de novo agendamento
    E devo ver uma mensagem de erro sobre telefone
