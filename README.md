# GeoLocator

Bem-vindo aoGeoLocator, uma API para gerenciamento de usuários e regiões geográficas.

## 📋 Pré-requisitos:
- Docker versão 20.0.6
- Docker compose versão v2.23.0

## Executando a aplicação
Clone o repositório para sua máquina utilizando o comando:

`git@github.com:julio-silveira/geolocator.git`

Entre na na pasta /server dentro da pasta do repositório

`cd geolocator/server`

Crie um arquivo .env com as seguintes váriaveis 

```
  API_PORT=3000
  MONGO_URI=mongodb://db:27017/geolocation

```
Execute o comando 
` docker-compose up`

E aguarde os containeres ficarem de pé e em seguida pode testar a aplicação!

### Testando a API

Na pasta collections/ tem um arquivo com a coleção pronta para ser importada no postman, além disso, endpoints disponíveis na api podem ser encontrados a acessando o caminho `/api-docs` com a aplicação no ar.

Já para rodar os testes automatizados, na pastar /server, execute o comando `yarn` para instalar os pacotes necessários e em seguida execute `yarn test` e aguarde  a execução da suite de testes.

### Tecnologias Utilizadas
- **Node.js**: Versão 20.
- **Banco de Dados**: Mongo 7.
- **ORM**: Mongoose / Typegoose.
- **Linguagem**: Typescript.
- **Formatação e Linting**: Eslint + prettier.

## Funcionalidades 

### Usuários
- **CRUD** completo para usuários.
- Cada usuário deve ter nome, email, endereço e coordenadas.
- Na criação, o usuário pode fornecer endereço ou coordenadas. Haverá erro caso forneça ambos ou nenhum.
- Uso de serviço de geolocalização para resolver endereço ↔ coordenadas.
- Atualização de endereço ou coordenadas deve seguir a mesma lógica.

### Regiões
- **CRUD** completo para regiões.
- Uma região é definida como um polígono em 	, um formato padrão para representar formas geográficas. Cada região tem um nome, um conjunto de coordenadas que formam o polígono, e um usuário que será o dono da região.
- Listar regiões contendo um ponto específico.
- Listar regiões a uma certa distância de um ponto, com opção de filtrar regiões não pertencentes ao usuário que fez a requisição.
- Exemplo de um polígono simples em GeoJSON:
  ```json
  {
    "type": "Polygon",
    "coordinates": [
      [
        [longitude1, latitude1],
        [longitude2, latitude2],
        [longitude3, latitude3],
        [longitude1, latitude1] // Fecha o polígono
      ]
    ]
  }
  ```
