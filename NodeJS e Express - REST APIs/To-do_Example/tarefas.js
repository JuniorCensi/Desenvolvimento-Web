import express, { json } from 'express';
const app = express();
const port = 3000;

// Middleware para parsear o corpo das requisições como JSON
app.use(json());

// Array para armazenar as tarefas (simulando um banco de dados em memória)
let tasks = [
  { id: 1, title: 'Aprender Express.js', completed: false },
  { id: 2, title: 'Construir uma API', completed: false }
];
let nextId = 3; // Contador para novos IDs

// --- Rotas da API de Tarefas ---

// GET /tasks: Retorna todas as tarefas
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks); // Envia as tarefas como JSON
});

// GET /tasks/:id: Retorna uma tarefa específica pelo ID
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id); // Converte o ID da URL para número
  const task = tasks.find(t => t.id === id); // Encontra a tarefa pelo ID

  if (task) {
    res.json(task);
  } else {
    res.status(404).send('Tarefa não encontrada.');
  }
});

// POST /tasks: Adiciona uma nova tarefa
app.post('/tasks', (req, res) => {
  const newTask = {
    id: nextId++,
    title: req.body.title, // Pega o título do corpo da requisição
    completed: false
  };

  if (!newTask.title) {
    return res.status(400).send('O título da tarefa é obrigatório.');
  }

  tasks.push(newTask);
  res.status(201).json(newTask); // Retorna a nova tarefa com status 201 (Created)
});

// PUT /tasks/:id: Atualiza uma tarefa existente
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex !== -1) {
    tasks[taskIndex].title = req.body.title || tasks[taskIndex].title;
    tasks[taskIndex].completed = req.body.completed !== undefined ? req.body.completed : tasks[taskIndex].completed;
    res.status(200).json(tasks[taskIndex]);
  } else {
    res.status(404).send('Tarefa não encontrada.');
  }
});

// DELETE /tasks/:id: Remove uma tarefa
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== id); // Filtra as tarefas, removendo a com o ID especificado

  if (tasks.length < initialLength) {
    res.status(204).send(); // Retorna 204 (No Content) se a exclusão foi bem-sucedida
  } else {
    res.status(404).send('Tarefa não encontrada.');
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor de tarefas rodando em http://localhost:${port}`);
});