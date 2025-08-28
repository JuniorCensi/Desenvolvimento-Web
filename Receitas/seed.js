import mongoose from 'mongoose';
import Comentario from './models/Comentario.js';
import Receita from './models/Receita.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Conectado ao MongoDB com sucesso! Porta', process.env.PORT);
    })
    .catch((err) => {
        console.error('Erro ao conectar ao MongoDB', err);
    });

const receitas = [{
    titulo: "Spaghetti Carbonara",
    ingredientes: ["Spaghetti", "Ovos", "Queijo Pecorino", "Pancetta", "Pimenta do Reino"],
    instrucoes: "Cozinhe o spaghetti. Em uma tigela, misture os ovos e o queijo. Adicione à massa e misture com a pancetta.",
    autor: "Chef Italiano",
    categoria: "Massas",
    dataCriacao: new Date()
},
{
    titulo: "Polenta",
    ingredientes: ["Farinha de Milho", "Água", "Sal", "Queijo (Opcional)"],
    instrucoes: "Misture a farinha de milho com água e sal. Cozinhe em fogo baixo, mexendo sempre, até obter uma consistência cremosa. Sirva com queijo por cima, se desejar.",
    autor: "Chef Brasileiro",
    categoria: "Massas",
    dataCriacao: new Date()
},
{
    titulo: "Brigadeiro",
    ingredientes: ["Leite Condensado", "Chocolate em Pó", "Manteiga", "Granulado"],
    instrucoes: "Em uma panela, misture o leite condensado, o chocolate em pó e a manteiga. Cozinhe em fogo baixo, mexendo sempre, até desgrudar do fundo da panela. Deixe esfriar, enrole em bolinhas e passe no granulado.",
    autor: "Chef Brasileiro",
    categoria: "Sobremesas",
    dataCriacao: new Date()
}];

const seedDB = async () => {
    await Receita.deleteMany({}); // Limpa o banco de dados de receitas
    await Comentario.deleteMany({}); // Limpa o banco de dados de comentários

    await Receita.insertMany(receitas)
        .then(() => {
            console.log('Banco de dados limpo! Receitas adicionadas');
        })
        .catch((err) => {
            console.error('Erro ao inserir dados', err);
        });

    mongoose.connection.close();
    console.log('Conexão com o MongoDB fechada');
};

seedDB()
