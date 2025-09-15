import { validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';

// POST - Criar novo usuário
export async function criarUsuario(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nome, cpf, telefoneCel, telefoneRes, email, senha, endereco } = req.body;

    try {
        const novoUsuario = new Usuario({
            nome,
            cpf,
            telefoneCel,
            telefoneRes,
            email,
            senha,
            endereco
        });

        await novoUsuario.save();
        res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
}

// GET - Listar todos os usuários
export async function getUsuarios(req, res) {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
}

// GET - Buscar usuário por ID
export async function getUsuarioById(req, res) {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário.', details: error.message });
    }
}

// PUT - Atualizar usuário
export async function atualizarUsuario(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json({ message: 'Usuário atualizado com sucesso!', usuario });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário.', details: error.message });
    }
}

// DELETE - Deletar usuário
export async function deletarUsuario(req, res) {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário.', details: error.message });
    }
}
