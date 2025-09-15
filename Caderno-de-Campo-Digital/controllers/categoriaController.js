import { validationResult } from 'express-validator';
import Categoria from '../models/Categoria.js';

// POST - Criar nova categoria
export async function criarCategoria(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nome, descricao, cor } = req.body;

    try {
        const novaCategoria = new Categoria({
            nome,
            descricao,
            cor
        });

        await novaCategoria.save();
        res.status(201).json({ message: 'Categoria criada com sucesso!', categoria: novaCategoria });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Nome da categoria já existe.' });
        }
        res.status(500).json({ error: 'Erro ao criar categoria.', details: error.message });
    }
}

// GET - Listar todas as categorias
export async function getCategorias(req, res) {
    try {
        const categorias = await Categoria.find();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar categorias.', details: error.message });
    }
}

// GET - Buscar categoria por ID
export async function getCategoriaById(req, res) {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ message: 'Categoria não encontrada.' });
        }
        res.status(200).json(categoria);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar categoria.', details: error.message });
    }
}

// PUT - Atualizar categoria
export async function atualizarCategoria(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const categoria = await Categoria.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!categoria) {
            return res.status(404).json({ message: 'Categoria não encontrada.' });
        }
        
        res.status(200).json({ message: 'Categoria atualizada com sucesso!', categoria });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Nome da categoria já existe.' });
        }
        res.status(500).json({ error: 'Erro ao atualizar categoria.', details: error.message });
    }
}

// DELETE - Deletar categoria
export async function deletarCategoria(req, res) {
    try {
        const categoria = await Categoria.findByIdAndDelete(req.params.id);
        
        if (!categoria) {
            return res.status(404).json({ message: 'Categoria não encontrada.' });
        }
        
        res.status(200).json({ message: 'Categoria deletada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar categoria.', details: error.message });
    }
}