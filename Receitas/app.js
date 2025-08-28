import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import receitaRoutes from './routes/receita.js';
import comentarioRoutes from './routes/comentario.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Configura EJS
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

// Conexão MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
        console.log('Conectado ao MongoDB com sucesso!');
    })
    .catch((err) => {
        console.error('Erro ao conectar ao MongoDB', err);
    });

// Rotas
app.use('/', receitaRoutes);
app.use('/', comentarioRoutes);

// 404
app.use((req, res) => {
    res.status(404).render('404', { path: req.path });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;
