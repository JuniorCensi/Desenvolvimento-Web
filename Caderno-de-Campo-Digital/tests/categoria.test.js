import request from 'supertest';
import { connectTestDB, disconnectTestDB, clearDatabase } from './setupTestDB.js';
import { createApp } from '../app.js';

let app;

// Testes CRUD para Categoria
describe('Categoria CRUD', () => {
  beforeAll(async () => {
    await connectTestDB();
    app = createApp();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  test('cria categoria', async () => {
    const res = await request(app)
      .post('/categorias')
      .send({ nome: 'Uvas Finas', descricao: 'Desc', cor: 'E39AFF' });
    expect(res.status).toBe(201);
    expect(res.body.categoria).toBeDefined();
  });

  test('lista categorias', async () => {
    await request(app).post('/categorias').send({ nome: 'Cat1', descricao: 'D1', cor: 'E39AFF' });
    await request(app).post('/categorias').send({ nome: 'Cat2', descricao: 'D2', cor: 'FFD0A1' });
    const res = await request(app).get('/categorias');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test('atualiza categoria', async () => {
    const created = await request(app).post('/categorias').send({ nome: 'Cat2', descricao: 'D2', cor: 'FFD0A1' });
    const id = created.body.categoria._id;
    const res = await request(app).put(`/categorias/${id}`).send({ nome: 'Cat2 Alterada', descricao: 'Nova', cor: 'FF9092' });
    expect(res.status).toBe(200);
    expect(res.body.categoria.nome).toBe('Cat2 Alterada');
  });

  test('deleta categoria', async () => {
    const created = await request(app).post('/categorias').send({ nome: 'Cat3', descricao: 'D3', cor: 'FF9092' });
    const id = created.body.categoria._id;
    const res = await request(app).delete(`/categorias/${id}`);
    expect(res.status).toBe(200);
  });
});
