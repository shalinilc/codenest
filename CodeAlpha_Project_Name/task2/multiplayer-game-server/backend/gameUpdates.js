const io = require('socket.io');

function handleGameUpdate(io, update) {
    io.emit('gameUpdate', update); // Broadcast update to all players
}

module.exports = { handleGameUpdate };
