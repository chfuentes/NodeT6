const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const msgInput = document.getElementById('msg');
const usersEscribiendo = [];

//Obtener nombre usuario y sala
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
//console.log(username,room);

const socket = io();

//Unirse a sala
socket.emit('joinRoom', { username, room });

//Obtener usuarios y salas
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//Mensajes provenientes del server
socket.on('message', message => {
    //console.log(message);
    outputMessage(message);
    //Scroll
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//Mensajes provenientes del server
socket.on('writemessage', message => {
    //console.log(message);
    outputWriteMessage(message);
    //Scroll
    //chatMessages.scrollTop = chatMessages.scrollHeight;
})

//Enviar mensaje
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //Obtener mensaje
    const msg = e.target.elements.msg.value;
    //Emitir mensaje de chat al server
    socket.emit('chatMessage', msg);
    //Limpiar
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

msgInput.addEventListener('keypress', (e) => {
    //const msg = e.target.elements.msg.value;
    const usuario = `${username}`;
    socket.emit('writeMessage', usuario + " esta escribiendo");
    /*const usuario = `${username}`;
    //console.log(usuario);
    const index = usersEscribiendo.findIndex(user => user === usuario); 
    console.log("INDEX->"+index); 
    if (index !== -1) { //Existe
        
    }
    else { //No Existe  
        usersEscribiendo.push(usuario);

        const div = document.createElement('div'); 
        div.classList.add('writtingmessage');
        div.innerHTML = `<p class="meta">${username} Esta escribiendo...</span></p>`;
        div.classList.add("animation")
        document.querySelector('.aux-chat-messages').appendChild(div);
        setTimeout(function () {
            div.parentNode.removeChild(div);
            return usersEscribiendo.splice(index,1); 
        }, 1500)
    }*/


    //
})

//Enviar mensaje al DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputWriteMessage(message) {
    const index = usersEscribiendo.findIndex(user => user === message);
    if (index !== -1) { //Existe
        //Me hago bolita
    }
    else {
        usersEscribiendo.push(message);
        const div = document.createElement('div');
        div.classList.add('writtingmessage');
        div.innerHTML = `<p class="meta">${message}</span></p>`;
        div.classList.add("animation")
        document.querySelector('.aux-chat-messages').appendChild(div);
        setTimeout(function () {
            div.parentNode.removeChild(div);
            return usersEscribiendo.splice(index, 1);
        }, 2000)
    }

}

//Agregar nombre sala al DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//Agregar usuario al DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
} 
