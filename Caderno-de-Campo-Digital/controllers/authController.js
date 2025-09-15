import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export async function registro(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { nome, cpf, telefoneCel, telefoneRes, email, senha, endereco } = req.body;

    const existente = await Usuario.findOne({ $or: [{ email }, { cpf }] });
    if (existente) {
      return res.status(400).json({ message: 'Email ou CPF já cadastrado.' });
    }

    const usuario = new Usuario({ nome, cpf, telefoneCel, telefoneRes, email, senha, endereco });
    await usuario.save();

    const token = gerarToken(usuario._id);
    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      token,
      usuario
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar.', details: err.message });
  }
}

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { emailOuCpf, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ $or: [{ email: emailOuCpf }, { cpf: emailOuCpf }] });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const senhaConfere = await usuario.compararSenha(senha);
    if (!senhaConfere) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = gerarToken(usuario._id);
    res.json({ message: 'Login realizado com sucesso!', token, usuario });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao realizar login.', details: err.message });
  }
}

function gerarToken(id) {
  const secret = process.env.JWT_SECRET || 'devsecret';
  return jwt.sign({ id }, secret, { expiresIn: '2h' });
}
