# language: pt
@appointment @regression
Funcionalidade: Novo agendamento
  Como usuario autenticado
  Quero criar um agendamento de servico
  Para reservar um horario com um profissional disponivel

  Contexto:
    Dado que estou autenticado como usuario normal
    E os dados de teste foram resetados

  @smoke
  Cenario: Criar agendamento com dados validos
    Quando acesso a pagina de novo agendamento
    E preencho um agendamento valido para "Cliente BDD QA"
    E confirmo o agendamento
    Entao devo ver mensagem de sucesso do agendamento
    E o agendamento "Cliente BDD QA" deve aparecer em Meus Agendamentos com status "CONFIRMADO"

  @regression @negative
  Cenario: Rejeitar agendamento com telefone invalido
    Quando acesso a pagina de novo agendamento
    E preencho um agendamento com telefone invalido para "Cliente Telefone BDD"
    E confirmo o agendamento
    Entao devo continuar na pagina de novo agendamento
    E devo ver uma mensagem de erro sobre telefone

  @regression @business-rule
  Cenario: Impedir novo agendamento em horario ja ocupado
    Dado que existe um agendamento confirmado para "Cliente Conflito Original" as "15:00"
    Quando acesso a pagina de novo agendamento
    E seleciono o mesmo profissional e data do agendamento existente
    Entao o horario "15:00" deve estar indisponivel para novo agendamento
