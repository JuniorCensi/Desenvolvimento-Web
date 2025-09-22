import { Router } from 'express';
import { body } from 'express-validator';
import {
    criarVariedade,
    getVariedades,
    getVariedadeById,
    getVariedadesPorCategoria,
    atualizarVariedade,
    deletarVariedade
} from '../controllers/variedadeController.js';

const router = Router();

const validarVariedade = [
    body('nome')
        .notEmpty().withMessage('Nome é obrigatório.')
        .isLength({ max: 20 }).withMessage('Nome deve ter no máximo 20 caracteres.'),
    body('descricao')
        .optional().isLength({ max: 100 }).withMessage('Descrição deve ter no máximo 100 caracteres.'),
    body('categoria')
        .notEmpty().withMessage('Categoria é obrigatória.')
        .isMongoId().withMessage('ID da categoria inválido.'),
    body('embalagem')
        .isArray().withMessage('Embalagem deve ser um array.')
        .custom((value) => {
            if (!Array.isArray(value)) throw new Error('Embalagem deve ser um array.');
            if (value.length === 0) return true; // Permite array vazio
            const isValid = value.every(id => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/));
            if (!isValid) throw new Error('IDs de embalagem inválidos.');
            return true;
        })
];

// Rotas CRUD
router.post('/', validarVariedade, criarVariedade);
router.get('/', getVariedades);
router.get('/:id', getVariedadeById);
router.get('/categoria/:categoriaId', getVariedadesPorCategoria);
router.put('/:id', validarVariedade, atualizarVariedade);
router.delete('/:id', deletarVariedade);

export default router;