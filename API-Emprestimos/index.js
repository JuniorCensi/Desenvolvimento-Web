import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from './models/Usuario.js';

dotenv.config();

const app = express();
app.use(express.json()); // parsing de JSON para requisições
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Conectado ao MongoDB com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error.message);
        process.exit(1);
    }
};

connectDB();

// Função para analisar modalidades de crédito disponíveis
function analisarCreditos({ age, income, location }) {
    const loans = [];

    // Crédito pessoal
    if (income <= 3000) {
        loans.push({ type: 'PERSONAL', interest_rate: 4 });
    } else if (income > 3000 && income < 5000 && age < 30 && location.toUpperCase() === 'PORTO ALEGRE') {
        loans.push({ type: 'PERSONAL', interest_rate: 4 });
    }

    // Crédito consignado
    if (income >= 5000) {
        loans.push({ type: 'CONSIGNMENT', interest_rate: 2 });
    }

    // Crédito com garantia
    if (income <= 3000) {
        loans.push({ type: 'GUARANTEED', interest_rate: 3 });
    } else if (income > 3000 && income < 5000 && age < 30 && location.toUpperCase() === 'PORTO ALEGRE') {
        loans.push({ type: 'GUARANTEED', interest_rate: 3 });
    }

    return loans;
}


app.get('/', (req, res) => {
    res.render('index');
});

app.post('/creditos', async (req, res) => {

    const { name, age, cpf, income, location } = req.body;
    if (!name || !age || !cpf || !income || !location) {
        return res.status(400).json({ error: 'Dados Incompletos!' });
    }

    // Limpa o CPF
    const cleanCPF = cpf.replace(/\D/g, ''); // Limpa o CPF

    // Validações
    if (age <= 0 || income < 2999 || cleanCPF.length !== 11) {
        return res.status(400).json({ error: 'Dados Incorretos!' });
    }

    // Busca usuário pelo CPF limpo
    let usuario = await Usuario.findOne({ cpf: cleanCPF });
    // Analisa créditos disponíveis
    const loans = analisarCreditos({ age, income, location });

    if (usuario) {
        // Atualiza dados do usuário
        await Usuario.updateOne({ cpf: cleanCPF }, { name, age, cpf: cleanCPF, income, location, loans });
        console.log('Usuário atualizado!');
    } else {
        usuario = new Usuario({ name, age, cpf: cleanCPF, income, location, loans });
        await usuario.save();
        console.log('Novo Usuário criado!');
    }

    return res.render('result', { customer: name, loans });
});

app.get('/usuarios', async (req, res) => {
    const usuarios = await Usuario.find();
    res.json(usuarios);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
