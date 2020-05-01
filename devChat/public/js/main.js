const chatForm = document.getElementById('chat-form');

const socket = io();

//Msg sent from server
socket.on('message', msg => {
  outputMessage(msg);
});

//Submit msg
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  //send msg to server
  socket.emit('chatMessage', msg);
});

//Msg to DOM
function outputMessage(msg) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
  <p class="text">
    ${msg}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}
