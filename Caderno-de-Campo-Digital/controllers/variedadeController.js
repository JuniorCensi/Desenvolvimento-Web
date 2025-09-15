import { validationResult } from 'express-validator';
import Variedade from '../models/Variedade.js';

// POST - Criar nova variedade
export async function criarVariedade(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nome, descricao, categoria, embalagem } = req.body;

    try {
        const novaVariedade = new Variedade({
            nome,
            descricao,
            categoria,
            embalagem
        });

        await novaVariedade.save();
        res.status(201).json({ message: 'Variedade criada com sucesso!', variedade: novaVariedade });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Nome da variedade já existe.' });
        }
        res.status(500).json({ error: 'Erro ao criar variedade.', details: error.message });
    }
}

// GET - Listar todas as variedades
export async function getVariedades(req, res) {
    try {
        const variedades = await Variedade.find()
            .populate('categoria', 'nome cor')
            .populate('embalagem', 'descricao tamanho');
        res.status(200).json(variedades);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar variedades.', details: error.message });
    }
}

// GET - Buscar variedade por ID
export async function getVariedadeById(req, res) {
    try {
        const variedade = await Variedade.findById(req.params.id)
            .populate('categoria', 'nome cor descricao')
            .populate('embalagem', 'descricao tamanho');
        
        if (!variedade) {
            return res.status(404).json({ message: 'Variedade não encontrada.' });
        }
        res.status(200).json(variedade);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar variedade.', details: error.message });
    }
}

// GET - Buscar variedades por categoria
export async function getVariedadesPorCategoria(req, res) {
    try {
        const variedades = await Variedade.find({ categoria: req.params.categoriaId })
            .populate('categoria', 'nome cor')
            .populate('embalagem', 'descricao tamanho');
        res.status(200).json(variedades);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar variedades por categoria.', details: error.message });
    }
}

// PUT - Atualizar variedade
export async function atualizarVariedade(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const variedade = await Variedade.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('categoria', 'nome cor').populate('embalagem', 'descricao tamanho');
        
        if (!variedade) {
            return res.status(404).json({ message: 'Variedade não encontrada.' });
        }
        
        res.status(200).json({ message: 'Variedade atualizada com sucesso!', variedade });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Nome da variedade já existe.' });
        }
        res.status(500).json({ error: 'Erro ao atualizar variedade.', details: error.message });
    }
}

// DELETE - Deletar variedade
export async function deletarVariedade(req, res) {
    try {
        const variedade = await Variedade.findByIdAndDelete(req.params.id);
        
        if (!variedade) {
            return res.status(404).json({ message: 'Variedade não encontrada.' });
        }
        
        res.status(200).json({ message: 'Variedade deletada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar variedade.', details: error.message });
    }
}