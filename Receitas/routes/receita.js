import { Router } from 'express';
import {
    listarReceitas,
    detalhesReceita,
    formNovaReceita,
    adicionarReceita
} from '../controllers/receita.js';

const router = Router();

// Página inicial: lista receitas
router.get('/', listarReceitas);

// Página de detalhes da receita
router.get('/receitas/:id', detalhesReceita);

// Formulário para nova receita
router.get('/nova-receita', formNovaReceita);

// Adiciona nova receita
router.post('/nova-receita', adicionarReceita);

export default router;
