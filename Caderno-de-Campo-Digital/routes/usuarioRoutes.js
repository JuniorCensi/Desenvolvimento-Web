import { Router } from 'express';
import { body } from 'express-validator';
import { criarUsuario, getUsuarios } from '../controllers/usuarioController.js';
const router = Router();

router.post(
    '/', 
    [
        body('nome').notEmpty().withMessage('Nome é obrigatório.'),
        body('cpf').notEmpty().withMessage('CPF é obrigatório.'),
        body('telefoneCel').notEmpty().withMessage('Telefone celular é obrigatório.'),
        body('email').isEmail().withMessage('Email inválido.'),
        body('senha').isLength({ min: 6, max: 15 }).withMessage('Senha deve ter entre 6 e 15 caracteres.')
    ],
    criarUsuario
);

router.get('/', getUsuarios);

export default router;