import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Configuração do banco de dados de teste em memória
let mongoServer;

// Conecta ao banco de dados de teste
export async function connectTestDB() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: 'testdb' });
}

// Desconecta o banco de dados de teste e para o servidor em memória
export async function disconnectTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) await mongoServer.stop();
}

// Limpa todas as coleções do banco de dados de teste
export async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany();
  }
}
