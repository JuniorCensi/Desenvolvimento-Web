import { Router } from 'express';
import { body } from 'express-validator';
import { 
    criarUsuario, 
    getUsuarios, 
    getUsuarioById, 
    atualizarUsuario, 
    deletarUsuario 
} from '../controllers/usuarioController.js';

const router = Router();

const validarUsuario = [
    body('nome')
        .notEmpty()
        .withMessage('Nome é obrigatório.'),
    body('email')
        .notEmpty()
        .withMessage('Email é obrigatório.')
];

// Rotas CRUD
router.post('/', validarUsuario, criarUsuario);
router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.put('/:id', validarUsuario, atualizarUsuario);
router.delete('/:id', deletarUsuario);

export default router;