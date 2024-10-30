const matchmakingQueue = [];

function startGame(io, gameId, playerId) {
    io.to(gameId).emit('startGame', { playerId });
}

module.exports = { matchmakingQueue, startGame };
