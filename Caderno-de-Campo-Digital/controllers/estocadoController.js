import { validationResult } from 'express-validator';
import Estocado from '../models/Estocado.js';

// POST - Criar novo estoque
export async function criarEstocado(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { item, quantidade, estimativaUnidades, estimativaPeso } = req.body;

    try {
        const novoEstocado = new Estocado({
            item,
            quantidade,
            estimativaUnidades,
            estimativaPeso
        });

        await novoEstocado.save();
        const estocadoCompleto = await Estocado.findById(novoEstocado._id)
            .populate({
                path: 'item',
                select: 'preco embalagem variedade',
                populate: [
                    {
                        path: 'embalagem',
                        select: 'descricao tamanho'
                    },
                    {
                        path: 'variedade',
                        select: 'nome descricao categoria',
                        populate: {
                            path: 'categoria',
                            select: 'nome cor'
                        }
                    }
                ]
            });

        res.status(201).json({ message: 'Estoque criado com sucesso!', estocado: estocadoCompleto });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar estoque.', details: error.message });
    }
}

// GET - Listar todos os estoques
export async function getEstocados(req, res) {
    try {
        const estocados = await Estocado.find()
            .populate({
                path: 'item',
                select: 'preco embalagem variedade',
                populate: [
                    {
                        path: 'embalagem',
                        select: 'descricao tamanho'
                    },
                    {
                        path: 'variedade',
                        select: 'nome descricao categoria',
                        populate: {
                            path: 'categoria',
                            select: 'nome cor'
                        }
                    }
                ]
            });
        res.status(200).json(estocados);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estoques.', details: error.message });
    }
}

// GET - Buscar estoque por ID
export async function getEstocadoById(req, res) {
    try {
        const estocado = await Estocado.findById(req.params.id)
            .populate({
                path: 'item',
                select: 'preco embalagem variedade',
                populate: [
                    {
                        path: 'embalagem',
                        select: 'descricao tamanho'
                    },
                    {
                        path: 'variedade',
                        select: 'nome descricao categoria',
                        populate: {
                            path: 'categoria',
                            select: 'nome cor'
                        }
                    }
                ]
            });
        
        if (!estocado) {
            return res.status(404).json({ message: 'Estoque não encontrado.' });
        }
        res.status(200).json(estocado);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estoque.', details: error.message });
    }
}

// GET - Buscar estoques com baixa quantidade (alerta)
export async function getEstoqueBaixo(req, res) {
    const limite = req.query.limite || 10; // quantidade mínima padrão
    
    try {
        const estocados = await Estocado.find({ quantidade: { $lte: limite } })
            .populate({
                path: 'item',
                select: 'preco embalagem variedade',
                populate: [
                    {
                        path: 'embalagem',
                        select: 'descricao tamanho'
                    },
                    {
                        path: 'variedade',
                        select: 'nome descricao categoria',
                        populate: {
                            path: 'categoria',
                            select: 'nome cor'
                        }
                    }
                ]
            });
        res.status(200).json(estocados);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estoques baixos.', details: error.message });
    }
}

// PUT - Atualizar estoque
export async function atualizarEstocado(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const estocado = await Estocado.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate({
            path: 'item',
            select: 'preco embalagem variedade',
            populate: [
                {
                    path: 'embalagem',
                    select: 'descricao tamanho'
                },
                {
                    path: 'variedade',
                    select: 'nome descricao categoria',
                    populate: {
                        path: 'categoria',
                        select: 'nome cor'
                    }
                }
            ]
        });
        
        if (!estocado) {
            return res.status(404).json({ message: 'Estoque não encontrado.' });
        }
        
        res.status(200).json({ message: 'Estoque atualizado com sucesso!', estocado });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar estoque.', details: error.message });
    }
}

// PUT - Atualizar quantidade do estoque (para vendas)
export async function atualizarQuantidade(req, res) {
    const { quantidade, operacao } = req.body; // operacao: 'adicionar' ou 'remover'
    
    try {
        const estocado = await Estocado.findById(req.params.id);
        
        if (!estocado) {
            return res.status(404).json({ message: 'Estoque não encontrado.' });
        }
        
        let novaQuantidade;
        if (operacao === 'adicionar') {
            novaQuantidade = estocado.quantidade + quantidade;
        } else if (operacao === 'remover') {
            novaQuantidade = estocado.quantidade - quantidade;
            if (novaQuantidade < 0) {
                return res.status(400).json({ message: 'Quantidade insuficiente em estoque.' });
            }
        } else {
            return res.status(400).json({ message: 'Operação inválida. Use "adicionar" ou "remover".' });
        }
        
        estocado.quantidade = novaQuantidade;
        await estocado.save();
        
        const estocadoAtualizado = await Estocado.findById(estocado._id)
            .populate({
                path: 'item',
                select: 'preco embalagem variedade',
                populate: [
                    {
                        path: 'embalagem',
                        select: 'descricao tamanho'
                    },
                    {
                        path: 'variedade',
                        select: 'nome descricao categoria',
                        populate: {
                            path: 'categoria',
                            select: 'nome cor'
                        }
                    }
                ]
            });
        
        res.status(200).json({ 
            message: `Quantidade ${operacao}da com sucesso!`, 
            estocado: estocadoAtualizado 
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar quantidade.', details: error.message });
    }
}

// DELETE - Deletar estoque
export async function deletarEstocado(req, res) {
    try {
        const estocado = await Estocado.findByIdAndDelete(req.params.id);
        
        if (!estocado) {
            return res.status(404).json({ message: 'Estoque não encontrado.' });
        }
        
        res.status(200).json({ message: 'Estoque deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar estoque.', details: error.message });
    }
}