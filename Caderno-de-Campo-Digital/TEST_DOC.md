# Estratégia de Testes

Este projeto utiliza **Jest**, **Supertest** e **mongodb-memory-server** para testes automatizados, sem necessidade de conexão com Mongo real.

## Objetivos dos Testes
- Garantir integridade das regras de negócio (auth, validações, relacionamentos)
- Evitar regressões ao evoluir o backend
- Facilitar refatorações futuras

## Tecnologias
| Biblioteca | Função |
|------------|-------|
| jest | Test runner e asserções |
| supertest | Simular requisições HTTP à API |
| mongodb-memory-server | Banco Mongo em memória para testes isolados |
| cross-env | Definir variáveis de ambiente cross-platform |

## Organização
```
/tests
  setupTestDB.js      # utilitário para subir/derrubar banco em memória
  auth.test.js        # testes de autenticação
  categoria.test.js   # CRUD de categorias
```

## Fluxo de Execução
1. Jest seta `NODE_ENV=test`
2. Cada suíte chama `connectTestDB()` criando um Mongo em memória
3. Após cada teste, `clearDatabase()` limpa coleções
4. Ao final da suíte, `disconnectTestDB()` encerra o servidor em memória

## Scripts
Executar testes:
```
npm test
```
## Ambiente de Teste
Não é necessário arquivo `.env` para os testes de CRUD simples, pois o Mongo é criado em memória. 

## Exemplo de Novo Teste (Modelo)
```javascript
import request from 'supertest';
import { connectTestDB, disconnectTestDB, clearDatabase } from './setupTestDB.js';
import { createApp } from '../app.js';

describe('Exemplo', () => {
  let app;
  beforeAll(async () => { await connectTestDB(); app = createApp(); });
  afterAll(async () => { await disconnectTestDB(); });
  afterEach(async () => { await clearDatabase(); });

  test('alguma rota', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });
});
```

