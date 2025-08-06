const express = require('express'); // Importa o Express
const Retangulo = require('./Retangulo');
const app = express(); // Recupera uma instância do Express
const portaServico = 3000;
// Middleware para habilitar o parsing de JSON no corpo das requisições
app.use(express.json());
// Rota: GET /usuarios
app.get('/retangulos/:base/:altura', (request, response) => {
    const base = request.params.base;
    const altura = request.params.altura;
    const retangulo1 = new Retangulo();
    retangulo1.base = base;
    retangulo1.altura = altura;
    const calculo = retangulo1.calcularArea();
    const objResposta = {
        base: parseFloat(retangulo1.base),
        altura: parseFloat(retangulo1.altura),
        area: parseFloat(calculo)
    }
    response.status(200).send(objResposta);
});
// Inicia a espera por requisições HTTP
app.listen(portaServico, () => {
    console.log(`API rodando no endereço: http://localhost:${portaServico}/`);
});