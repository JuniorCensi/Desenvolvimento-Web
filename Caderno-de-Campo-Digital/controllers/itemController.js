import { validationResult } from 'express-validator';
import Item from '../models/Item.js';

// POST - Criar novo item
export async function criarItem(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { embalagem, variedade, preco } = req.body;

    try {
        const novoItem = new Item({
            embalagem,
            variedade,
            preco
        });

        await novoItem.save();
        const itemCompleto = await Item.findById(novoItem._id)
            .populate('embalagem', 'descricao tamanho')
            .populate({
                path: 'variedade',
                select: 'nome descricao categoria',
                populate: {
                    path: 'categoria',
                    select: 'nome cor'
                }
            });

        res.status(201).json({ message: 'Item criado com sucesso!', item: itemCompleto });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar item.', details: error.message });
    }
}

// GET - Listar todos os itens
export async function getItens(req, res) {
    try {
        const itens = await Item.find()
            .populate('embalagem', 'descricao tamanho')
            .populate({
                path: 'variedade',
                select: 'nome descricao categoria',
                populate: {
                    path: 'categoria',
                    select: 'nome cor'
                }
            });
        res.status(200).json(itens);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar itens.', details: error.message });
    }
}

// GET - Buscar item por ID
export async function getItemById(req, res) {
    try {
        const item = await Item.findById(req.params.id)
            .populate('embalagem', 'descricao tamanho')
            .populate({
                path: 'variedade',
                select: 'nome descricao categoria',
                populate: {
                    path: 'categoria',
                    select: 'nome cor'
                }
            });
        
        if (!item) {
            return res.status(404).json({ message: 'Item não encontrado.' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar item.', details: error.message });
    }
}

// GET - Buscar itens por variedade
export async function getItensPorVariedade(req, res) {
    try {
        const itens = await Item.find({ variedade: req.params.variedadeId })
            .populate('embalagem', 'descricao tamanho')
            .populate({
                path: 'variedade',
                select: 'nome descricao categoria',
                populate: {
                    path: 'categoria',
                    select: 'nome cor'
                }
            });
        res.status(200).json(itens);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar itens por variedade.', details: error.message });
    }
}

// PUT - Atualizar item
export async function atualizarItem(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('embalagem', 'descricao tamanho')
         .populate({
             path: 'variedade',
             select: 'nome descricao categoria',
             populate: {
                 path: 'categoria',
                 select: 'nome cor'
             }
         });
        
        if (!item) {
            return res.status(404).json({ message: 'Item não encontrado.' });
        }
        
        res.status(200).json({ message: 'Item atualizado com sucesso!', item });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar item.', details: error.message });
    }
}

// DELETE - Deletar item
export async function deletarItem(req, res) {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        
        if (!item) {
            return res.status(404).json({ message: 'Item não encontrado.' });
        }
        
        res.status(200).json({ message: 'Item deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar item.', details: error.message });
    }
}