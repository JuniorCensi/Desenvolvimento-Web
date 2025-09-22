import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import winston from 'winston';
import rateLimit from 'express-rate-limit';

// Logger Winston para relatórios de acesso e erros
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app-winston.log' })
  ],
});

import usuarioRoutes from './routes/usuarioRoutes.js';
import authRoutes from './routes/authRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import embalagemRoutes from './routes/embalagemRoutes.js';
import variedadeRoutes from './routes/variedadeRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import estocadoRoutes from './routes/estocadoRoutes.js';
import vendaRoutes from './routes/vendaRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { protegerSite } from './middleware/authMiddleware.js';

// Função para criação da aplicação Express (usada no index.js) 
export function createApp() {
  const app = express();
  app.set('view engine', 'ejs');
  app.set('views', path.join(process.cwd(), 'views'));
  app.use(express.static(path.join(process.cwd(), 'public')));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

  // Rate limit apenas para login (evita ataques de força bruta)
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // 10 tentativas por IP
    message: { message: 'Muitas tentativas de login, tente novamente em alguns minutos.' }
  });

  app.use('/auth/login', loginLimiter);
  app.use('/auth', authRoutes);
  app.use('/usuarios', usuarioRoutes);
  app.use('/categorias', categoriaRoutes);
  app.use('/embalagens', embalagemRoutes);
  app.use('/variedades', variedadeRoutes);
  app.use('/itens', itemRoutes);
  app.use('/estoque', estocadoRoutes);
  app.use('/vendas', vendaRoutes);

  // Auth Middleware para proteger as rotas de páginas (exceto login)
  app.use(protegerSite);

  // Home protegida (renderiza sem dados do usuário, JS busca via API)
  app.get('/', (req, res) => {
    res.render('home');
  });

  // Página de produção (renderiza, em cards, a lista de variedades)
  app.get('/producao', (req, res) => {
    res.render('producao');
  });

  // Perfil do usuário (renderiza sem dados do usuário, JS busca via API)
  app.get('/perfil', (req, res) => {
    res.render('usuarioPerfil', { perfilAtivo: true });
  });

  // Renderiza a página de login
  app.get('/login', (req, res) => {
    res.render('login', { erro: null });
  });

  // Logout: limpa o token do localStorage
  app.get('/logout', (req, res) => {
    res.setHeader('Set-Cookie', 'Authorization=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict');
    res.render('login', { erro: null });
  });

  app.use(notFound);
  // Log de erro com winston
  app.use((err, req, res, next) => {
    logger.error(`${req.method} ${req.url} - ${err.message}`);
    errorHandler(err, req, res, next);
  });
  return app;
}

export default createApp;