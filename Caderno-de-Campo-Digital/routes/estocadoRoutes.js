import { Router } from 'express';
import { body } from 'express-validator';
import {
    criarEstocado,
    getEstocados,
    getEstocadoById,
    getEstoqueBaixo,
    atualizarEstocado,
    atualizarQuantidade,
    deletarEstocado
} from '../controllers/estocadoController.js';

const router = Router();

const validarEstocado = [
    body('item')
        .notEmpty().withMessage('Item é obrigatório.')
        .isMongoId().withMessage('ID do item inválido.'),
    body('quantidade')
        .notEmpty().withMessage('Quantidade é obrigatória.')
        .isInt({ min: 1 }).withMessage('Quantidade deve ser um número inteiro positivo.'),
    body('estimativaUnidades')
        .notEmpty().withMessage('Estimativa de unidades é obrigatória.')
        .isInt({ min: 1 }).withMessage('Estimativa de unidades deve ser um número inteiro positivo.'),
    body('estimativaPeso')
        .notEmpty().withMessage('Estimativa de peso é obrigatória.')
        .isFloat({ min: 0 }).withMessage('Estimativa de peso deve ser um número positivo.')
];

const validarQuantidade = [
    body('quantidade')
        .notEmpty()
        .withMessage('Quantidade é obrigatória.')
        .isInt({ min: 1 })
        .withMessage('Quantidade deve ser um número inteiro positivo.'),
    body('operacao')
        .notEmpty()
        .withMessage('Operação é obrigatória.')
        .isIn(['adicionar', 'remover'])
        .withMessage('Operação deve ser "adicionar" ou "remover".')
];

// Rotas CRUD
router.post('/', validarEstocado, criarEstocado);
router.get('/', getEstocados);
router.get('/baixo', getEstoqueBaixo); // Deve vir antes de /:id
router.get('/:id', getEstocadoById);
router.put('/:id', validarEstocado, atualizarEstocado);
router.patch('/:id/quantidade', validarQuantidade, atualizarQuantidade);
router.delete('/:id', deletarEstocado);

export default router;