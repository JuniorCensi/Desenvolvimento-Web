import { Router } from 'express';
import { body } from 'express-validator';
import {
    criarEmbalagem,
    getEmbalagens,
    getEmbalagemById,
    atualizarEmbalagem,
    deletarEmbalagem
} from '../controllers/embalagemController.js';

const router = Router();

const validarEmbalagem = [
    body('descricao')
        .notEmpty().withMessage('Descrição é obrigatória.')
        .isLength({ max: 40 }).withMessage('Descrição deve ter no máximo 40 caracteres.'),
    body('tamanho')
        .notEmpty().withMessage('Tamanho é obrigatório.')
        .isIn(['PP', 'P', 'M', 'G', 'GG']).withMessage('Tamanho deve ser: PP, P, M, G ou GG.')
];

router.post('/', validarEmbalagem, criarEmbalagem);
router.get('/', getEmbalagens);
router.get('/:id', getEmbalagemById);
router.put('/:id', validarEmbalagem, atualizarEmbalagem);
router.delete('/:id', deletarEmbalagem);

export default router;