const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMsg = require('./utils/message');
const {
  userJoin,
  getCurrentUser,
  userLeaves,
  getRoomUsers
} = require('./utils/users');

const botName = 'devChat Bot';

const app = express();
const server = http.createServer(app);

const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run connection
io.on('connection', socket => {
  //Join room
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    //Client connects
    socket.emit('message', formatMsg(botName, 'Welcome to devChat'));

    //Broadcast when user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMsg(botName, `${user.username} has joined the chat`)
      );

    //Set users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  //listen for chat message
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMsg(user.username, msg));
  });

  //Client disconnects
  socket.on('disconnect', () => {
    const user = userLeaves(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        formatMsg(botName, `${user.username} has left the chat`)
      );
      //Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server runnning on port ${PORT}`));
