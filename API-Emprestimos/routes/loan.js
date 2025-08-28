import { Router } from 'express';
import { analisarCreditosController } from '../controllers/loan.js';

const router = Router();

// Rota para análise de créditos
router.post('/', analisarCreditosController);

export default router;
