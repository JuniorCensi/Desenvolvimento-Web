import Comentario from '../models/Comentario.js';

// Lista os comentários de uma receita
export const listarComentarios = async (req, res) => {
    try {
        const receitaId = req.params.id;
        const comentarios = await Comentario.find({ receitaId: receitaId });
        res.json(comentarios);
    } catch (err) {
        res.status(500).send('Erro ao listar comentários');
    }
};

// Adiciona um novo comentário a uma receita
export const adicionarComentario = async (req, res) => {
    try {
        const { texto, autor } = req.body;
        const receitaId = req.params.id;
        const comentario = new Comentario({
            texto,
            autor,
            receitaId: receitaId,
            dataCriacao: new Date()
        });
        console.log(comentario);
        await comentario.save();
        res.redirect(`/receitas/${receitaId}`);
    } catch (err) {
        res.status(400).send('Erro ao adicionar comentário');
    }
};
