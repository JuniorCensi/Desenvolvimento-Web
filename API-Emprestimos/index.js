import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import loanRoutes from './routes/loan.js';
import usuarioRoutes from './routes/usuario.js';

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

app.get('/', (req, res) => {
    res.render('index');
});
app.use('/creditos', loanRoutes);
app.use('/usuarios', usuarioRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
