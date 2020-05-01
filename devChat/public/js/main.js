const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersNames = document.getElementById('users');

//get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

//Join chat room
socket.emit('joinRoom', { username, room });

//get room and users info
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsersName(users);
});

//Msg sent from server
socket.on('message', msg => {
  outputMessage(msg);
  //automatic scroll
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Submit msg
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  //send msg to server
  socket.emit('chatMessage', msg);
  //clear input form
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//Msg to DOM
function outputMessage(msg) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
  <p class="text">
    ${msg.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

//output room name
function outputRoomName(room) {
  roomName.innerText = room;
}

//output users name
function outputUsersName(users) {
  usersNames.innerHTML = `${users
    .map(user => `<li>${user.username}</li>`)
    .join('')}`;
}
