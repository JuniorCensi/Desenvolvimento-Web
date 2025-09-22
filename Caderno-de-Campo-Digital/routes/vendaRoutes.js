import { Router } from 'express';
import { body } from 'express-validator';
import {
    criarVenda,
    getVendas,
    getVendaById,
    getRelatorioVendas,
    atualizarVenda,
    cancelarVenda
} from '../controllers/vendaController.js';

const router = Router();

const validarVenda = [
    body('itemEmEstoque')
        .notEmpty().withMessage('Item em estoque é obrigatório.')
        .isMongoId().withMessage('ID do item em estoque inválido.'),
    body('quantidade')
        .notEmpty().withMessage('Quantidade é obrigatória.')
        .isInt({ min: 1 }).withMessage('Quantidade deve ser um número inteiro positivo.'),
    body('precoTotal')
        .notEmpty().withMessage('Preço total é obrigatório.')
        .isFloat({ min: 0 }).withMessage('Preço total deve ser um número positivo.')
];

const validarAtualizacaoVenda = [
    body('precoTotal')
        .notEmpty().withMessage('Preço total é obrigatório.')
        .isFloat({ min: 0 }).withMessage('Preço total deve ser um número positivo.')
];

// Rotas CRUD
router.post('/', validarVenda, criarVenda);
router.get('/', getVendas);
router.get('/relatorio', getRelatorioVendas); // Deve vir antes de /:id
router.get('/:id', getVendaById);
router.put('/:id', validarAtualizacaoVenda, atualizarVenda);
router.delete('/:id', cancelarVenda); // Cancelar venda (devolver ao estoque)

export default router;