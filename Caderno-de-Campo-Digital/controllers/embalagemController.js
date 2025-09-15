import { validationResult } from 'express-validator';
import Embalagem from '../models/Embalagem.js';

// POST - Criar nova embalagem
export async function criarEmbalagem(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { descricao, tamanho } = req.body;

    try {
        const novaEmbalagem = new Embalagem({
            descricao,
            tamanho
        });

        await novaEmbalagem.save();
        res.status(201).json({ message: 'Embalagem criada com sucesso!', embalagem: novaEmbalagem });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar embalagem.', details: error.message });
    }
}

// GET - Listar todas as embalagens
export async function getEmbalagens(req, res) {
    try {
        const embalagens = await Embalagem.find();
        res.status(200).json(embalagens);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar embalagens.', details: error.message });
    }
}

// GET - Buscar embalagem por ID
export async function getEmbalagemById(req, res) {
    try {
        const embalagem = await Embalagem.findById(req.params.id);
        if (!embalagem) {
            return res.status(404).json({ message: 'Embalagem não encontrada.' });
        }
        res.status(200).json(embalagem);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar embalagem.', details: error.message });
    }
}

// PUT - Atualizar embalagem
export async function atualizarEmbalagem(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const embalagem = await Embalagem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!embalagem) {
            return res.status(404).json({ message: 'Embalagem não encontrada.' });
        }
        
        res.status(200).json({ message: 'Embalagem atualizada com sucesso!', embalagem });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar embalagem.', details: error.message });
    }
}

// DELETE - Deletar embalagem
export async function deletarEmbalagem(req, res) {
    try {
        const embalagem = await Embalagem.findByIdAndDelete(req.params.id);
        
        if (!embalagem) {
            return res.status(404).json({ message: 'Embalagem não encontrada.' });
        }
        
        res.status(200).json({ message: 'Embalagem deletada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar embalagem.', details: error.message });
    }
}