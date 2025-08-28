import { validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';

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

export async function getUsuarios(req, res) {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
}
