import request from 'supertest';
import { connectTestDB, disconnectTestDB, clearDatabase } from './setupTestDB.js';
import { createApp } from '../app.js';
import Usuario from '../models/Usuario.js';

let app;

// Testes para rotas de autenticação (registro e login)
describe('Auth Routes', () => {

  // Configura o banco de dados de teste antes dos testes
  beforeAll(async () => {
    await connectTestDB();
    app = createApp();
  });

  // Desconecta o banco de dados após os testes
  afterAll(async () => {
    await disconnectTestDB();
  });

  // Limpa o banco de dados entre os testes
  afterEach(async () => {
    await clearDatabase();
  });

  // Descreve o teste de registro
  test('registro cria usuário e retorna token sem senha', async () => {
    const res = await request(app)
      .post('/auth/registro')
      .send({
        nome: 'Teste',
        cpf: '12345678901',
        telefoneCel: '(11) 98888-7777',
        email: 'teste@example.com',
        senha: 'segredo123',
        endereco: [{
          rua: 'Rua X', numero: '10', cep: '12345-000', bairro: 'Centro', cidade: 'Cidade', estado: 'SP'
        }]
      });
    
    // Respostas esperadas
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.usuario).toBeDefined();
    expect(res.body.usuario.senha).toBeUndefined();

    const u = await Usuario.findOne({ email: 'teste@example.com' }).lean();
    expect(u).toBeTruthy();
  });

  test('não permite registro duplicado (email ou cpf)', async () => {
    await request(app).post('/auth/registro').send({
      nome: 'Teste', cpf: '12345678901', telefoneCel: '(11) 98888-7777', email: 'dup@example.com', senha: 'abc123', endereco: []
    });

    const res = await request(app).post('/auth/registro').send({
      nome: 'Teste2', cpf: '12345678901', telefoneCel: '(11) 98888-7777', email: 'dup@example.com', senha: 'abc123', endereco: []
    });
    expect(res.status).toBe(400);
  });

  test('login com email funciona', async () => {
    await request(app).post('/auth/registro').send({
      nome: 'Login Email', cpf: '99988877766', telefoneCel: '123', email: 'login@example.com', senha: 'abc12345', endereco: []
    });

    const res = await request(app).post('/auth/login').send({
      emailOuCpf: 'login@example.com', senha: 'abc12345'
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('login com cpf funciona', async () => {
    await request(app).post('/auth/registro').send({
      nome: 'Login CPF', cpf: '22233344455', telefoneCel: '123', email: 'login2@example.com', senha: 'abc12345', endereco: []
    });

    const res = await request(app).post('/auth/login').send({
      emailOuCpf: '22233344455', senha: 'abc12345'
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('login falha com senha incorreta', async () => {
    await request(app).post('/auth/registro').send({
      nome: 'Login Fail', cpf: '55566677788', telefoneCel: '123', email: 'fail@example.com', senha: 'abc12345', endereco: []
    });

    const res = await request(app).post('/auth/login').send({
      emailOuCpf: 'fail@example.com', senha: 'senhaErrada'
    });

    expect(res.status).toBe(401);
  });
});
