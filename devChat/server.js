const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run connection
io.on('connection', socket => {
  //Client connects
  socket.emit('message', 'Welcome to the chat!');

  //Broadcast when user connects
  socket.broadcast.emit('message', 'A user has joined the chat');

  //Client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  });

  //listen for chat message
  socket.on('chatMessage', msg => {
    io.emit('message', msg);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server runnning on port ${PORT}`));
