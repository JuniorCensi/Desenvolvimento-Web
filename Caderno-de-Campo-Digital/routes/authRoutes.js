import { Router } from 'express';
import { body } from 'express-validator';
import { registro, login } from '../controllers/authController.js';

const router = Router();

const validarRegistro = [
  body('nome').notEmpty().withMessage('Nome é obrigatório.'),
  body('cpf').notEmpty().withMessage('CPF é obrigatório.'),
  body('telefoneCel').notEmpty().withMessage('Telefone celular é obrigatório.'),
  body('email').isEmail().withMessage('Email inválido.'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres.')
];

const validarLogin = [
  body('emailOuCpf').notEmpty().withMessage('Email ou CPF é obrigatório.'),
  body('senha').notEmpty().withMessage('Senha é obrigatória.')
];

router.post('/registro', validarRegistro, registro);
router.post('/login', validarLogin, login);

export default router;
