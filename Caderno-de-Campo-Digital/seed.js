import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from './models/Usuario.js';
import Categoria from './models/Categoria.js';
import Embalagem from './models/Embalagem.js';
import Variedade from './models/Variedade.js';
import Item from './models/Item.js';
import Estocado from './models/Estocado.js';
import Venda from './models/Venda.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://JuEduCensi:Rabito1000ju!@cluster0.bhclw.mongodb.net/Caderno-de-Campo-Digital?retryWrites=true&w=majority&appName=Cluster0';

async function seed() {
  try {
    // Conecta ao MongoDB
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado ao MongoDB!');

    // Limpa todas as coleções
    await Promise.all([
      Usuario.deleteMany({}),
      Categoria.deleteMany({}),
      Embalagem.deleteMany({}),
      Variedade.deleteMany({}),
      Item.deleteMany({}),
      Estocado.deleteMany({}),
      Venda.deleteMany({}),
    ]);
    console.log('Coleções limpas.');

    // Cria Usuário
    const usuario = await Usuario.create({
      nome: 'Júnior Censi',
      cpf: '12345678900',
      email: 'juninhoe.censi@gmail.com',
      senha: 'admin123', // O hash será feito automaticamente pelo middleware
      telefoneCel: '54984117709',
      endereco: [{
        rua: 'Estrada das Hortências',
        numero: '260',
        cep: '95274-000',
        bairro: 'Mato Perso',
        cidade: 'Flores da Cunha',
        estado: 'RS'
      }],
    });
    console.log('Usuário inserido.');

    // Adiciona Categorias
    const categorias = await Categoria.insertMany([
      { nome: 'Pêssegos', descricao: 'Área de cultivo de 2 hectares', cor: 'FFD0A1' },
      { nome: 'Ameixas', descricao: 'Área de cultivo de 1 hectare', cor: 'FF9092' },
      { nome: 'Uvas', descricao: 'Área de cultivo de 3 hectares', cor: 'E39AFF' },
    ]);
    console.log('Categorias inseridas.');

    // Adiciona Embalagens
    const embalagens = await Embalagem.insertMany([
      { descricao: 'Caixa', tamanho: 'PP' },
      { descricao: 'Unitário', tamanho: 'M' },
    ]);
    console.log('Embalagens inseridas.');

    // Adiciona Variedades
    const variedades = await Variedade.insertMany([
      { nome: 'Cheripá', descricao: 'Pêssego Cheripá', categoria: categorias[0]._id, embalagem: embalagens[0]._id },
      { nome: 'Letícia', descricao: 'Ameixa Letícia', categoria: categorias[1]._id, embalagem: embalagens[1]._id },
      { nome: 'Rubi', descricao: 'Uva Rubi', categoria: categorias[2]._id, embalagem: embalagens[1]._id },
    ]);
    console.log('Variedades inseridas.');

    // Adiciona Itens
    const itens = await Item.insertMany([
      { preco: 15.0, variedade: variedades[0]._id, embalagem: embalagens[0]._id },
      { preco: 2.0, variedade: variedades[1]._id, embalagem: embalagens[1]._id },
    ]);
    console.log('Itens inseridos.');

    // Adiciona Itens em Estoque
    const estocados = await Estocado.insertMany([
      { item: itens[0]._id, quantidade: 20 },
      { item: itens[1]._id, quantidade: 15 },
    ]);
    console.log('Estocados inseridos.');

    // Adiciona Vendas
    await Venda.insertMany([
      {
        itemEmEstoque: estocados[0]._id,
        quantidade: 2,
        precoTotal: 2 * itens[0].preco
      },
      {
        itemEmEstoque: estocados[1]._id,
        quantidade: 3,
        precoTotal: 3 * itens[1].preco
      }
    ]);
    console.log('Vendas inseridas.');

    console.log('Seed finalizado com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao rodar seed:', err);
    process.exit(1);
  }
}

// Executa o seed
seed();
