const users = [];

async function addUser(username, password) {
    const user = { id: users.length + 1, username, password, stats: {} };
    users.push(user);
    return user;
}

function getUserByToken(username) {
    return users.find(user => user.username === username);
}

async function updateStats(userId, newStats) {
    const user = users.find(user => user.id === userId);
    if (user) {
        user.stats = newStats;
    }
}

module.exports = { addUser, getUserByToken, updateStats };
