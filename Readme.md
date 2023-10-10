### Challenge of Rocketseat Ignite NodeJS 02 - Daily Diet API

#### Regras da Aplicação

- Deve ser possível criar um usuário
- Deve ser possível identificar o usuário entre as requisições
- Deve ser possível registrar uma refeição feita, com as seguintes informações:
    *As refeições devem ser relacionadas a um usuário.*
    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta
- Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- Deve ser possível apagar uma refeição
- Deve ser possível listar todas as refeições de um usuário
- Deve ser possível visualizar uma única refeição
- Deve ser possível recuperar as métricas de um usuário
    - Quantidade total de refeições registradas
    - Quantidade total de refeições dentro da dieta
    - Quantidade total de refeições fora da dieta
    - Melhor sequência de refeições dentro da dieta
- O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

#### Contexto da aplicação

É comum ao estar desenvolvendo uma API, imaginar como esses dados vão estar sendo utilizados pelo cliente web e/ou mobile.

Por isso, deixamos abaixo o link para o layout da aplicação que utilizaria essa API.

https://www.figma.com/community/file/1218573349379609244


#### Como executar

1 - Clone o repositório
2 - Instale as dependências do projeto
```
npm install
```
3 - Execute as migrations do banco de dados
```
npm run knex -- migrate:latest
```
4 - Rode a aplicação
```
npm run dev
```
5 - Utilize o arquivo do Insomnia para reutilizar as rotas que já deixei preparadas para o teste, o arquivo se encontra na pasta raiz com o nome: *Insomnia_API*