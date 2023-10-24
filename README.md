# Backend Lemon Desafio

## Description

Developed using [Nest](https://github.com/nestjs/nest) Framework

Calculate and check eligibility for a new client of Lemon Energy, if available calculate the prospect CO2 emission reductions.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Running the app](#starting)
- [Paths](#paths)
  - [Check Elegibility](#check-elegibility-function)
  - [Hello World Version](#helloworld)
- [Test](#test)
- [Swagger](#swagger)
- [Description of The Test](#description-of-test)
- [Examples](#examples)

## Installation

```bash
$ npm install
```

## Running the App

### Starting

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Paths

### Check Elegibility Function

```http
POST /v1/clients/check-eligibility
```

Body:

```json
{
  "numeroDoDocumento": "14041737706",
  "tipoDeConexao": "bifasico",
  "classeDeConsumo": "comercial",
  "modalidadeTarifaria": "convencional",
  "historicoDeConsumo": [
    3878, // mes atual
    9760, // mes anterior
    5976, // 2 meses atras
    2797, // 3 meses atras
    2481, // 4 meses atras
    5731, // 5 meses atras
    7538, // 6 meses atras
    4392, // 7 meses atras
    7859, // 8 meses atras
    4160, // 9 meses atras
    6941, // 10 meses atras
    4597 // 11 meses atras
  ]
}
```

Expected Response:

```json
{
  "elegivel": true,
  "economiaAnualDeCO2": 5553.24
}
```

### HealthCheck

```http
GET /health
```

Expected Response

```json
{
  "status": "ok",
  "info": {
    "nestjs-docs": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "nestjs-docs": {
      "status": "up"
    }
  }
}
```

### HelloWorld

either v1 or v2 should work

```http
GET /v1/clients
```

Expected Response:
Hello World V1 or V2 Depending on which one you called

## Swagger

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

```http
GET /api-docs
```

## ENV

Env File can be found on:
**src/config/config.env**

<table>
  <tr>
    <td><code>TTL</code></td>
    <td>Time To Live: the number in milliseconds of the throttling rate</td>
  </tr>
  <tr>
    <td><code>LIMIT</code></td>
    <td>Number of Requests of throttling rate within the TTL</td>
  </tr>
  <tr>
    <td><code>PORT</code></td>
    <td>PORT of the current server</td>
  </tr>
</table>

TTL=Rate Limitter Time To Live
LIMIT= Rate Limitter Limite

Some Tests may use the Rate Limitter so don't forget about them when setting them up

## Description of Test

Considere os json schemas abaixo como as definições da entrada e saída para o cálculo de elegibilidade:

```js
const {
  tiposDeConexao,
  classesDeConsumo,
  modalidadesTarifarias,
  cpf,
  cnpj,
} = require('./tipos');

const enumOf = (values) => ({
  type: typeof values[0],
  enum: values,
  example: values[0],
});

const input = {
  type: 'object',
  additionalProperties: false,
  required: [
    'numeroDoDocumento',
    'tipoDeConexao',
    'classeDeConsumo',
    'modalidadeTarifaria',
    'historicoDeConsumo',
  ],
  properties: {
    numeroDoDocumento: { oneOf: [cpf, cnpj] },
    tipoDeConexao: enumOf(tiposDeConexao),
    classeDeConsumo: enumOf(classesDeConsumo),
    modalidadeTarifaria: enumOf(modalidadesTarifarias),
    historicoDeConsumo: {
      // em kWh
      type: 'array',
      minItems: 3,
      maxItems: 12,
      items: {
        type: 'integer',
        minimum: 0,
        maximum: 9999,
      },
    },
  },
};

const output = {
  oneOf: [
    {
      type: 'object',
      additionalProperties: false,
      required: ['elegivel', 'economiaAnualDeCO2'],
      properties: {
        elegivel: enumOf([true]), // always true
        economiaAnualDeCO2: { type: 'number', minimum: 0 },
      },
    },
    {
      type: 'object',
      additionalProperties: false,
      required: ['elegivel', 'razoesDeInelegibilidade'],
      properties: {
        elegivel: enumOf([false]), // always false
        razoesDeInelegibilidade: {
          type: 'array',
          uniqueItems: true,
          items: {
            type: 'string',
            enum: [
              'Classe de consumo não aceita',
              'Modalidade tarifária não aceita',
              'Consumo muito baixo para tipo de conexão',
            ],
          },
        },
      },
    },
  ],
};

module.exports = {
  input,
  output,
};
```

- Arquivo `tipos.js`

  ```jsx
  const cpf = {
    type: 'string',
    pattern: '^\\d{11}$',
    example: '21554495008',
  };

  const cnpj = {
    type: 'string',
    pattern: '^\\d{14}$',
    example: '33400689000109',
  };

  const tiposDeConexao = ['monofasico', 'bifasico', 'trifasico'];

  const classesDeConsumo = [
    'residencial',
    'industrial',
    'comercial',
    'rural',
    'poderPublico',
  ];

  const modalidadesTarifarias = ['azul', 'branca', 'verde', 'convencional'];

  module.exports = {
    cpf,
    cnpj,
    tiposDeConexao,
    classesDeConsumo,
    modalidadesTarifarias,
  };
  ```

Para checar a elegibilidade iremos aplicar os seguintes critérios:

- Classe de consumo da cliente
  - Possíveis Valores: Comercial, Residencial, Industrial, Poder Público, e Rural.
  - Elegíveis: Comercial, Residencial e Industrial.
- Modalidade tarifária
  - Possíveis Valores: Branca, Azul, Verde, e Convencional.
  - Elegíveis: Convencional, Branca.
- Consumo mínimo do cliente
  - O cálculo deve ser feito utilizando a média dos 12 valores mais recentes do histórico de consumo.
    - Clientes com tipo de conexão Monofásica só são elegíveis caso tenham consumo médio acima de 400 kWh.
    - Clientes com tipo de conexão Bifásica só são elegíveis caso tenham consumo médio acima de 500 kWh.
    - Clientes com tipo de conexão Trifásica só são elegíveis caso tenham consumo médio acima de 750 kWh.
- Para calcular a projeção da economia anual de CO2, considere que para serem gerados 1000 kWh no Brasil são emitidos em média 84kg de CO2.

# Examples

## Eligible

Entrada

```json
{
  "numeroDoDocumento": "14041737706",
  "tipoDeConexao": "bifasico",
  "classeDeConsumo": "comercial",
  "modalidadeTarifaria": "convencional",
  "historicoDeConsumo": [
    3878, // mes atual
    9760, // mes anterior
    5976, // 2 meses atras
    2797, // 3 meses atras
    2481, // 4 meses atras
    5731, // 5 meses atras
    7538, // 6 meses atras
    4392, // 7 meses atras
    7859, // 8 meses atras
    4160, // 9 meses atras
    6941, // 10 meses atras
    4597 // 11 meses atras
  ]
}
```

Saída

```json
{
  "elegivel": true,
  "economiaAnualDeCO2": 5553.24
}
```

## Ineligible

Entrada

```json
{
  "numeroDoDocumento": "14041737706",
  "tipoDeConexao": "bifasico",
  "classeDeConsumo": "rural",
  "modalidadeTarifaria": "verde",
  "historicoDeConsumo": [
    3878, // mes atual
    9760, // mes anterior
    5976, // 2 meses atras
    2797, // 3 meses atras
    2481, // 4 meses atras
    5731, // 5 meses atras
    7538, // 6 meses atras
    4392, // 7 meses atras
    7859, // 8 meses atras
    4160 // 9 meses atras
  ]
}
```

Saída

```json
{
  "elegível": false,
  "razoesInelegibilidade": [
    "Classe de consumo não atendida",
    "Modalidade tarifária não aceita"
  ]
}
```
