# Timesheet app

Utilizei o máximo de conhecimento em DDD, separando os agregados Expediente e Relatório e mantendo-os desacoplados. Procurei manter também o padrão de "linguagem onipresente".

## TODO
- Faltam alguns casos de testes unitários
- Testes end-to-end

## Running the app

```bash
$ docker compose build

$ docker compose up
```

## Installation

```bash
$ npm install
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
