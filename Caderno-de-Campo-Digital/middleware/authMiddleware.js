
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

// Middleware para proteger APIs (retorna JSON 401)
export async function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'devsecret';
    const decoded = jwt.verify(token, secret);
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) return res.status(401).json({ message: 'Usuário não encontrado.' });
    req.usuario = usuario; // anexa usuário ao request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

// Middleware para proteger rotas de páginas (redireciona para login)
export function protegerSite(req, res, next) {
  // Permitir acesso livre ao login e APIs de autenticação
  if (req.path === '/login' || req.path.startsWith('/auth')) {
    return next();
  }
  // Permitir assets públicos
  if (req.path.startsWith('/css') || req.path.startsWith('/js') || req.path.startsWith('/img')) {
    return next();
  }
  // Tentar autenticar via JWT
  const authHeader = req.headers.authorization || (req.headers.cookie && req.headers.cookie.split('; ').find(c => c.startsWith('Authorization='))?.split('=')[1]);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.redirect('/login');
  }
  // Validar JWT
  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'devsecret';
  try {
    jwt.verify(token, secret);
    return next();
  } catch {
    return res.redirect('/login');
  }
}
