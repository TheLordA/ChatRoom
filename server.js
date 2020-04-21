const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin,getCurrentUser,getRoomUsers,userLeave } = require('./utils/users');

const app = express();
const server = http.createServer(app); 
const io = socket(server);
const botName ='Chat BOT'

// Set Static folder 
app.use(express.static(path.join(__dirname,'public')));

// When a client connects
io.on('connection', socket =>{

    // When the user join a Room Chat
    socket.on('joinRoom',({username,room}) => {
        const user = userJoin(socket.id,username,room);

        socket.join(user.room);

        // Welcome to the user who has just connected
        socket.emit('message',formatMessage(botName,'Welcome aboard ^-^ '));

        // BroadCast when a user connects
        socket.broadcast
            .to(user.room)
            .emit('message',formatMessage(botName,`${user.username} has joined the chat.`));

        // Sending users & room info
        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        });
    });

    // Intercept the ChatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // If a client disconnect
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id); 
        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat.`));

            // Sending users & room info
            io.to(user.room).emit('roomUsers',{
                room : user.room,
                users : getRoomUsers(user.room)
            });
        }
    });
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT,() => console.log(`Server running on port ${PORT}`));