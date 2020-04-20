const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket(server);

// Set Static folder 
app.use(express.static(path.join(__dirname,'public')));

// When a client connects
io.on('connection', socket =>{

    // Welcome to the user who has just connected
    socket.emit('message','Welcome to Chat !!');

    // BroadCast when a user connects
    socket.broadcast.emit('message','A user has joined the chat.');

    // If a client disconnect
    socket.on('disconnect', ()=>{
        io.emit('message','A user has left the chat.')
    });

    // Intercept the ChatMessage
    socket.on('ChatMessage',(msg)=>{
        //BroadCast the msg to everyone
        io.emit('message', msg ); 
    });
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT,() => console.log(`Server running on port ${PORT}`));