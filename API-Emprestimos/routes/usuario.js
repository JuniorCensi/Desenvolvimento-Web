import { Router } from "express";
import { abrirFormulario } from "../controllers/usuario.js";
import { listarUsuariosController } from "../controllers/loan.js";

const router = Router();


// Formulário para sumissão de usuários
router.get('/', abrirFormulario);

// Listar usuários
router.get('/listar', listarUsuariosController);

export default router;