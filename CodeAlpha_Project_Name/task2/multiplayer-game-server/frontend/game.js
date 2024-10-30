const socket = io();

document.getElementById('joinGame').addEventListener('click', () => {
    socket.emit('joinGame', { gameId: 'default' });
});

socket.on('startGame', (data) => {
    console.log('Game started for:', data.playerId);
});

socket.on('gameUpdate', (update) => {
    console.log('Game Update:', update);
});
