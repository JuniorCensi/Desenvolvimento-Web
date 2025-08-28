import Usuario from '../models/Usuario.js';

// Função para analisar modalidades de crédito disponíveis
function analisarCreditos({ age, income, location }) {
    const loans = [];
    // Crédito pessoal
    if (income <= 3000) {
        loans.push({ type: 'PERSONAL', interest_rate: 4 });
    } else if (income > 3000 && income < 5000 && age < 30 && location.toUpperCase() === 'PORTO ALEGRE') {
        loans.push({ type: 'PERSONAL', interest_rate: 4 });
    }
    // Crédito consignado
    if (income >= 5000) {
        loans.push({ type: 'CONSIGNMENT', interest_rate: 2 });
    }
    // Crédito com garantia
    if (income <= 3000) {
        loans.push({ type: 'GUARANTEED', interest_rate: 3 });
    } else if (income > 3000 && income < 5000 && age < 30 && location.toUpperCase() === 'PORTO ALEGRE') {
        loans.push({ type: 'GUARANTEED', interest_rate: 3 });
    }
    return loans;
}

export const analisarCreditosController = async (req, res) => {
    const { name, age, cpf, income, location } = req.body;
    if (!name || !age || !cpf || !income || !location) {
        return res.status(400).json({ error: 'Dados Incompletos!' });
    }
    const cleanCPF = cpf.replace(/\D/g, '');
    if (age <= 0 || income < 2999 || cleanCPF.length !== 11) {
        return res.status(400).json({ error: 'Dados Incorretos!' });
    }
    let usuario = await Usuario.findOne({ cpf: cleanCPF });
    const loans = analisarCreditos({ age, income, location });
    if (usuario) {
        await Usuario.updateOne({ cpf: cleanCPF }, { name, age, cpf: cleanCPF, income, location, loans });
    } else {
        usuario = new Usuario({ name, age, cpf: cleanCPF, income, location, loans });
        await usuario.save();
    }
    return res.render('result', { customer: name, loans });
};

export const listarUsuariosController = async (req, res) => {
    const usuarios = await Usuario.find();
    res.json(usuarios);
};
