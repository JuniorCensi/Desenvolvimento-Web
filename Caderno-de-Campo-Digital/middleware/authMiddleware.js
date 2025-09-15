import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

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
    res.status(401).json({ message: 'Token inválido ou expirado.', details: err.message });
  }
}
