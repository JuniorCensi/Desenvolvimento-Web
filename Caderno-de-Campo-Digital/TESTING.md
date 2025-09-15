# Estratégia de Testes

Este projeto utiliza **Jest**, **Supertest** e **mongodb-memory-server** para testes automatizados sem necessidade de um Mongo real.

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
Não é necessário arquivo `.env` para os testes de CRUD simples, pois o Mongo é criado em memória. Caso precise testar algo que depende de variáveis (ex: JWT secret customizado), você pode:
```
cross-env NODE_ENV=test JWT_SECRET=teste123 npm test
```

## Boas Práticas Adotadas
- Banco em memória garante isolamento e velocidade
- Sem dependência de dados anteriores (estado limpo por teste)
- Testes focados: um comportamento por `test()`
- `runInBand` evita concorrência desnecessária com MongoMemoryServer

## Extensões Futuras
- Adicionar testes para: Itens, Variedades, Estoque, Vendas, Relatórios
- Mock de datas (ex: `jest.useFakeTimers`) para relatórios
- Cobertura de código (ex: `--coverage` no script de test)
- Pipeline CI (GitHub Actions) rodando `npm ci && npm test`

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

## Próximos Passos Recomendados
1. Adicionar testes de erro (IDs inválidos, validações, estoque insuficiente)
2. Proteger rotas e testar acesso sem token / com token inválido
3. Adicionar `role` no usuário e testar autorização
4. Implementar cobertura (`npm pkg set scripts.test="cross-env NODE_ENV=test jest --runInBand --coverage"`)
5. Testes de performance pontuais (ex: grandes volumes de itens) usando seeds

---
Dúvidas ou quer ajuda para criar os testes restantes? Abra uma issue interna ou peça diretamente. 🚀
