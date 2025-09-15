import { Router } from 'express';
import { body } from 'express-validator';
import { 
    criarCategoria, 
    getCategorias, 
    getCategoriaById, 
    atualizarCategoria, 
    deletarCategoria 
} from '../controllers/categoriaController.js';

const router = Router();

// Validações
const validarCategoria = [
    body('nome')
        .notEmpty()
        .withMessage('Nome é obrigatório.')
        .isLength({ max: 30 })
        .withMessage('Nome deve ter no máximo 15 caracteres.'),
    body('descricao')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Descrição deve ter no máximo 100 caracteres.'),
    body('cor')
        .notEmpty()
        .withMessage('Cor é obrigatória.')
        .isIn(['E39AFF', 'FFD0A1', 'FF9092'])
        .withMessage('Cor deve ser uma das opções válidas: E39AFF (uva), FFD0A1 (pêssego), FF9092 (ameixa).')
];

// Rotas CRUD
router.post('/', validarCategoria, criarCategoria);
router.get('/', getCategorias);
router.get('/:id', getCategoriaById);
router.put('/:id', validarCategoria, atualizarCategoria);
router.delete('/:id', deletarCategoria);

export default router;