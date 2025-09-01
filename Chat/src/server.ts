import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.render('index');
});

// Gerenciamento de usuários e histórico
interface User {
    id: string;
    username: string;
}
const users: Record<string, User> = {};
const MESSAGE_HISTORY_SIZE = 20;
let messageHistory: { username: string; message: string }[] = [];

io.on('connection', (socket) => {
    let username = '';

    socket.on('setUsername', (name: string) => {
        const isNewUser = !users[socket.id];
        username = name;
        users[socket.id] = { id: socket.id, username };
        socket.emit('history', messageHistory);
        if (isNewUser) {
            socket.broadcast.emit('notification', `${username} entrou no chat.`);
            console.log(`Usuário conectado: ${username} (${socket.id})`);
        }
    });

    socket.on('chatMessage', (msg: string) => {
        if (!username) return;
        const data = { username, message: msg };
        messageHistory.push(data);
        if (messageHistory.length > MESSAGE_HISTORY_SIZE) {
            messageHistory = messageHistory.slice(-MESSAGE_HISTORY_SIZE);
        }
        io.emit('chatMessage', data);
    });

    socket.on('disconnect', () => {
        if (username) {
            socket.broadcast.emit('notification', `${username} saiu do chat.`);
            console.log(`Usuário desconectado: ${username} (${socket.id})`);
            delete users[socket.id];
        }
    });
});

server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});