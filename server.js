const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server)
//Setear carpeta estatica
app.use(express.static(path.join(__dirname, 'public')));
const botName = 'Chat Bot';
// Correr cuando se conecten clientes
io.on('connection', socket => {
    //console.log('Nueva conexion por Socket');
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        //Enviar mensaje de bienvenida
        socket.emit('message', formatMessage(botName, 'Bienvenido al chat'));
        //Enviar cuando el usuario se conecte
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} se ha unido al chat`));
        //Enviar info de usuarios y salas
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })
    // Escuchar mensajes tipo chat
    socket.on('chatMessage', msg => {
        //console.log(msg);
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })
    socket.on('writeMessage', msg => {
        //console.log(msg);
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('writemessage', msg)
    })

    //Enviar cuando el usuario se desconecte
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} ha abandonado el chat`));
            //Enviar info de usuarios y salas 
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room) 
            });
        }

    });
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT} `));