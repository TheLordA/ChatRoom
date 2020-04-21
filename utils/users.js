const users = [];

// join user to chat
function userJoin(id,username,room){
    const user = {id,username,room};
    users.push(user);
    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// When a user leaves
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    // check if the user id exists
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
};

// Get user's room
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};