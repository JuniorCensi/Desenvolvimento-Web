import { validationResult } from 'express-validator';
import Venda from '../models/Venda.js';
import Estocado from '../models/Estocado.js';

// POST - Criar nova venda
export async function criarVenda(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { itemEmEstoque, quantidade, precoTotal } = req.body;

    try {
        // Verificar se há estoque suficiente
        const estoque = await Estocado.findById(itemEmEstoque);
        if (!estoque) {
            return res.status(404).json({ message: 'Item em estoque não encontrado.' });
        }
        
        if (estoque.quantidade < quantidade) {
            return res.status(400).json({ 
                message: 'Quantidade insuficiente em estoque.',
                disponivel: estoque.quantidade,
                solicitado: quantidade
            });
        }

        // Criar a venda
        const novaVenda = new Venda({
            itemEmEstoque,
            quantidade,
            precoTotal
        });

        await novaVenda.save();

        // Atualizar o estoque (diminuir a quantidade)
        estoque.quantidade -= quantidade;
        await estoque.save();

        const vendaCompleta = await Venda.findById(novaVenda._id)
            .populate({
                path: 'itemEmEstoque',
                select: 'quantidade estimativaUnidades estimativaPeso item',
                populate: {
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
                }
            });

        res.status(201).json({ message: 'Venda realizada com sucesso!', venda: vendaCompleta });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao realizar venda.', details: error.message });
    }
}

// GET - Listar todas as vendas
export async function getVendas(req, res) {
    try {
        const vendas = await Venda.find()
            .populate({
                path: 'itemEmEstoque',
                select: 'quantidade estimativaUnidades estimativaPeso item',
                populate: {
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
                }
            })
            .sort({ createdAt: -1 }); // Ordenar por data de criação (mais recente primeiro)
        
        res.status(200).json(vendas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar vendas.', details: error.message });
    }
}

// GET - Buscar venda por ID
export async function getVendaById(req, res) {
    try {
        const venda = await Venda.findById(req.params.id)
            .populate({
                path: 'itemEmEstoque',
                select: 'quantidade estimativaUnidades estimativaPeso item',
                populate: {
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
                }
            });
        
        if (!venda) {
            return res.status(404).json({ message: 'Venda não encontrada.' });
        }
        res.status(200).json(venda);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar venda.', details: error.message });
    }
}

// READ - Relatório de vendas por período
export async function getRelatorioVendas(req, res) {
    const { dataInicio, dataFim } = req.query;
    
    try {
        let filtro = {};
        
        if (dataInicio || dataFim) {
            filtro.createdAt = {};
            if (dataInicio) filtro.createdAt.$gte = new Date(dataInicio);
            if (dataFim) filtro.createdAt.$lte = new Date(dataFim);
        }
        
        const vendas = await Venda.find(filtro)
            .populate({
                path: 'itemEmEstoque',
                populate: {
                    path: 'item',
                    populate: [
                        {
                            path: 'embalagem',
                            select: 'descricao tamanho'
                        },
                        {
                            path: 'variedade',
                            select: 'nome categoria',
                            populate: {
                                path: 'categoria',
                                select: 'nome cor'
                            }
                        }
                    ]
                }
            })
            .sort({ createdAt: -1 });
        
        // Calcular totais
        const totalVendas = vendas.length;
        const valorTotal = vendas.reduce((total, venda) => total + venda.precoTotal, 0);
        const quantidadeTotal = vendas.reduce((total, venda) => total + venda.quantidade, 0);
        
        res.status(200).json({
            vendas,
            resumo: {
                totalVendas,
                valorTotal,
                quantidadeTotal,
                periodo: {
                    inicio: dataInicio || 'Início',
                    fim: dataFim || 'Atual'
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar relatório de vendas.', details: error.message });
    }
}

// UPDATE - Atualizar venda (limitado - apenas preço)
export async function atualizarVenda(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Só permite atualizar o preço total
    const { precoTotal } = req.body;

    try {
        const venda = await Venda.findByIdAndUpdate(
            req.params.id,
            { precoTotal },
            { new: true, runValidators: true }
        ).populate({
            path: 'itemEmEstoque',
            populate: {
                path: 'item',
                populate: [
                    {
                        path: 'embalagem',
                        select: 'descricao tamanho'
                    },
                    {
                        path: 'variedade',
                        select: 'nome categoria',
                        populate: {
                            path: 'categoria',
                            select: 'nome cor'
                        }
                    }
                ]
            }
        });
        
        if (!venda) {
            return res.status(404).json({ message: 'Venda não encontrada.' });
        }
        
        res.status(200).json({ message: 'Venda atualizada com sucesso!', venda });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar venda.', details: error.message });
    }
}

// DELETE - Cancelar venda (devolver ao estoque)
export async function cancelarVenda(req, res) {
    try {
        const venda = await Venda.findById(req.params.id);
        
        if (!venda) {
            return res.status(404).json({ message: 'Venda não encontrada.' });
        }
        
        // Devolver a quantidade ao estoque
        const estoque = await Estocado.findById(venda.itemEmEstoque);
        if (estoque) {
            estoque.quantidade += venda.quantidade;
            await estoque.save();
        }
        
        // Deletar a venda
        await Venda.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ 
            message: 'Venda cancelada com sucesso! Quantidade devolvida ao estoque.',
            quantidadeDevolvida: venda.quantidade
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cancelar venda.', details: error.message });
    }
}