// Importa o módulo 'express'
const express = require('express');

// Cria uma instância do aplicativo Express
const app = express();

// Define a porta em que o servidor irá escutar
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware para analisar o corpo das requisições como JSON

app.get('/', (req, res) => {
    res.send('Olá, esta é a rota raiz!');
})

// Define uma rota GET para o endpoint '/hello'
// Quando uma requisição é feita para '/hello', essa função será executada
app.get('/hello', (req, res) => {
    // Envia uma resposta com o texto 'Hello, World!'
    res.send('Hello, World!');
})

// Rota: GET /usuarios/id
app.get('/usuarios/:id', (request, response) => {
    const id = request.params.id;
    const resposta = { msg: 'Recebi um GET com o id:' + id };
    response.status(200).send(resposta);
});

// Rota: POST /usuarios
app.post('/usuarios', (request, response) => {
    const nome = request.body.nome; // Exemplo de dado enviado no corpo da
    const resposta = { msg: `Recebi um post com nome ${nome}` };
    response.status(200).send(resposta);
});

// Rota: PUT /usuarios/:id
app.put('/usuarios/:id', (request, response) => {
    const id = request.params.id;
    const nome = request.body.nome; // Exemplo de dado enviado no corpo da requisição
    const resposta = { msg: `Recebi um PUT para o usuário com ID ${id}, alterando nome para ${nome}` };
    response.status(200).send(resposta);
});

// Rota: DELETE /usuarios/:id
app.delete('/usuarios/:id', (request, response) => {
    const id = request.params.id;
    const resposta = { msg: `Recebi um DELETE para o usuário com ID ${id}` };
    response.status(200).send(resposta);
});

// Inicia o servidor e faz com que ele escute na porta definida
app.listen(PORT, () => {
    // Exibe uma mensagem no console indicando que o servidor está rodando
    console.log(`Servidor Express rodando em http://localhost:${PORT}`);
    console.log(`Acesse http://localhost:3000/ ou Acesse http://localhost:3000/hello para ver a mensagem.`);
});