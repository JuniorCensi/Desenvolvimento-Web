import { Router } from 'express';
import { 
    adicionarComentario, 
    listarComentarios 
} from '../controllers/comentario.js';

const router = Router();

// Lista os comentários da receita
router.get('/receitas/:id/comentarios', listarComentarios);

// Adiciona comentário a uma receita
router.post('/receitas/:id/comentarios', adicionarComentario);

export default router;
