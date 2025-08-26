import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import usuarioRoutes from './routes/usuarioRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/usuarios', usuarioRoutes);

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conexão com o MongoDB estabelecida com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
  });

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));