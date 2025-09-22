import { Router } from 'express';
import { body } from 'express-validator';
import {
    criarUsuario,
    getUsuarios,
    getUsuarioById,
    atualizarUsuario,
    deletarUsuario
} from '../controllers/usuarioController.js';
import { autenticar } from '../middleware/authMiddleware.js';

const router = Router();

// Rota para autenticação do usuário
router.get('/me', autenticar, (req, res) => {
    res.json(req.usuario);
});

// Rota para atualizar perfil do usuário autenticado
router.put('/me', autenticar, async (req, res) => {
    try {
        const usuario = req.usuario;
        usuario.telefoneCel = req.body.telefoneCel;
        usuario.telefoneRes = req.body.telefoneRes;
        await usuario.save();
        res.json({ message: 'Perfil atualizado!', usuario });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar perfil.', details: err.message });
    }
});

// Rotas para atualizar endereços do usuário autenticado
router.put('/me/endereco/:idx', autenticar, async (req, res) => {
    try {
        const usuario = req.usuario;
        const idx = parseInt(req.params.idx);
        if (!usuario.endereco[idx]) return res.status(404).json({ error: 'Endereço não encontrado.' });
        usuario.endereco[idx] = req.body;
        await usuario.save();
        res.json({ message: 'Endereço atualizado!', usuario });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar endereço.', details: err.message });
    }
});

// Rota para adicionar novo endereço ao usuário autenticado
router.post('/me/endereco', autenticar, async (req, res) => {
    try {
        const usuario = req.usuario;
        usuario.endereco.push(req.body);
        await usuario.save();
        res.json({ message: 'Endereço adicionado!', usuario });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao adicionar endereço.', details: err.message });
    }
});

// Rota para remover endereço do usuário autenticado
router.delete('/me/endereco/:idx', autenticar, async (req, res) => {
    try {
        const usuario = req.usuario;
        const idx = parseInt(req.params.idx);
        if (!usuario.endereco[idx]) return res.status(404).json({ error: 'Endereço não encontrado.' });
        usuario.endereco.splice(idx, 1);
        await usuario.save();
        res.json({ message: 'Endereço removido!', usuario });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao remover endereço.', details: err.message });
    }
});

// Funções de validação
const validarUsuario = [
    body('nome').notEmpty().withMessage('Nome é obrigatório.'),
    body('email').notEmpty().withMessage('Email é obrigatório.')
];

// Rotas CRUD administrativas
router.post('/', validarUsuario, criarUsuario);
router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.put('/:id', validarUsuario, atualizarUsuario);
router.delete('/:id', deletarUsuario);

export default router;