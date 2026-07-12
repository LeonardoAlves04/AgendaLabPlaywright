# language: pt
@auth @regression
Funcionalidade: Autenticacao de usuarios
  Como usuario da plataforma AgendaLab QA
  Quero acessar apenas areas permitidas com credenciais validas
  Para manter meus agendamentos protegidos

  @smoke
  Cenario: Redirecionar usuario nao autenticado para login
    Quando tento acessar o dashboard sem estar autenticado
    Entao devo ser redirecionado para a pagina de login

  @smoke
  Cenario: Login com usuario normal
    Dado que acesso a pagina de login
    Quando informo credenciais validas do usuario normal
    Entao devo visualizar o dashboard do usuario normal

  @regression
  Cenario: Bloquear usuario com acesso bloqueado
    Dado que acesso a pagina de login
    Quando informo credenciais do usuario bloqueado
    Entao devo ver a mensagem de acesso bloqueado
