import { Router } from 'express';
import { body } from 'express-validator';
import {
    criarItem,
    getItens,
    getItemById,
    getItensPorVariedade,
    atualizarItem,
    deletarItem
} from '../controllers/itemController.js';

const router = Router();

const validarItem = [
    body('embalagem')
        .notEmpty().withMessage('Embalagem é obrigatória.')
        .isMongoId().withMessage('ID da embalagem inválido.'),
    body('variedade')
        .notEmpty().withMessage('Variedade é obrigatória.')
        .isMongoId().withMessage('ID da variedade inválido.'),
    body('preco')
        .notEmpty().withMessage('Preço é obrigatório.')
        .isFloat({ min: 0 }).withMessage('Preço deve ser um número positivo.')
        .custom((value) => {
            if (value.toString().replace('.', '').length > 7) throw new Error('Preço deve ter no máximo 7 dígitos.');
            return true;
        })
];
router.post('/', validarItem, criarItem);
router.get('/', getItens);
router.get('/:id', getItemById);
router.get('/variedade/:variedadeId', getItensPorVariedade);
router.put('/:id', validarItem, atualizarItem);
router.delete('/:id', deletarItem);

export default router;