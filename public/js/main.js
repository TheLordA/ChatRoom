const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');   

const socket = io();

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
    socket.emit('ChatMessage',msg);
    // Clear input field
    e.target.elements.msg.value ='';
    e.target.elements.msg.focus();

});

// Print out the message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">${message}</p>`;
    document.querySelector('.chat-messages').append(div);
};