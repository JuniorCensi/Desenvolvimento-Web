import Receita from '../models/Receita.js';
import Comentario from '../models/Comentario.js';

// Lista receitas com paginação, busca e filtro
export const listarReceitas = async (req, res) => {
    const { page = 1, limit = 5, busca = '', categoria = '' } = req.query;
    const filtro = {};
    if (busca) {
        filtro.titulo = { $regex: busca, $options: 'i' };
    }
    if (categoria) {
        filtro.categoria = categoria;
    }
    try {
        const receitas = await Receita.find(filtro)
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Receita.countDocuments(filtro);
    res.render('home', { receitas, total, page, busca, categoria, path: '/' });
    } catch (err) {
        res.status(500).send('Erro ao buscar receitas');
    }
};

// Carrega detalhes da receita buscando por ID
export const detalhesReceita = async (req, res) => {
    try {
        const receita = await Receita.findById(req.params.id);
    const comentarios = await Comentario.find({ receitaId: req.params.id });
    res.render('receita', { receita, comentarios, path: `/receitas/${req.params.id}` });
    } catch (err) {
        res.status(404).send('Receita não encontrada');
    }
};

// Renderiza o formulário para adicionar nova receita
export const formNovaReceita = (req, res) => {
    res.render('novaReceita', { path: '/nova-receita' });
};

// Cria, adiciona e salva nova receita no BD
export const adicionarReceita = async (req, res) => {
    try {
        const { titulo, ingredientes, instrucoes, autor, categoria } = req.body;
        const receita = new Receita({
            titulo,
            ingredientes: Array.isArray(ingredientes) ? ingredientes : ingredientes.split(','),
            instrucoes,
            autor,
            categoria,
            dataCriacao: new Date()
        });
        await receita.save();
        res.redirect('/');
    } catch (err) {
        res.status(400).send('Erro ao adicionar receita');
    }
};
