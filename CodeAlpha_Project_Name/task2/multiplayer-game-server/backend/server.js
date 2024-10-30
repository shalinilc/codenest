const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { addUser, getUserByToken, updateStats } = require('./database');
const { matchmakingQueue, startGame } = require('./matchmaker');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(session({ secret: 'supersecret', resave: false, saveUninitialized: true }));

// User Authentication
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await addUser(username, hashedPassword);
    res.json(user);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByToken(username);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, username }, 'jwtsecret');
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Matchmaking
app.post('/queue', (req, res) => {
    const { token } = req.body;
    const user = getUserByToken(token);
    if (user) {
        matchmakingQueue.push(user);
        res.json({ message: 'Queued for matchmaking' });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinGame', ({ gameId }) => {
        socket.join(gameId);
        startGame(io, gameId, socket.id);
    });

    socket.on('gameUpdate', (update) => {
        const gameId = update.gameId;
        io.to(gameId).emit('gameUpdate', update);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
