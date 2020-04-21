const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username & Room from URL
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix : true
});

const socket = io();

// Join ChatRoom
socket.emit('joinRoom',{username , room});

// Get Room name & his users
socket.on('roomUsers',({users,room}) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message From the Server 
socket.on('message', message =>{
    outputMessage(message);

    // Scroll Down 
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message Submit 
chatForm.addEventListener('submit',e =>{
    e.preventDefault();
    // GEt message text
    const msg = e.target.elements.msg.value;

    // emit the message to the server
    socket.emit('chatMessage',msg);

    // Clear input field
    e.target.elements.msg.value ='';
    e.target.elements.msg.focus();

});

// Print out the message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span> ${message.time} </span></p>
    <p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').append(div);
};

// Add room's name to DOM
function outputRoomName(room){
    roomName.innerText = room;
};



// add users names to room users list at DOM
function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user =>`<li>${user.username}</li>`).join('')}
    `;
}