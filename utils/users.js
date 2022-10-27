const users = [];

//Unir usuario a chat
function userJoin(id, username, room) {
    const user = {id, username, room};
    users.push(user);
    return user;
}

//Obtener usuario 
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

//Usuario sale del chat
function userLeave(id) { 
    const index = users.findIndex(user => user.id === id);
    if(index !== -1 ) { 
        return users.splice(index,1)[0];
    }
}

//Obtener usuarios de una sala
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}