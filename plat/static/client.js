const socket = io();

const welcomeBlock = document.querySelector('.welcome')
const usernameInput = document.querySelector('.username-input');
const usernameButton = document.querySelector('.sent-username')
const chat = document.querySelector('.chat')
let username;

usernameButton.onclick = function (e) {
    e.preventDefault()
    welcomeBlock.style.display = "none"
    chat.style.display = "block"
    username = usernameInput.value;
    socket.emit('new user', username);     
};

const messageForm = document.querySelector('.message-form');
const messageInput = document.querySelector('.message');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if(messageInput.value) {
        socket.emit('new message', messageInput.value);
        messageInput.value = '';
    }
})

socket.on('send message', data => {
    const messageList = document.querySelector('.message-area');
    const chatItem = document.createElement('li');
    const messageItem = document.createElement('span')

    const usersCounter = document.querySelector('.users-counter');
    data.users ? usersCounter.textContent = `Всего участников: ${data.users}` : 0;

    messageItem.style.color = data.color
    messageItem.textContent = data.message;

    chatItem.textContent = data.user ?
    data.user + ": " : "";
    chatItem.appendChild(messageItem)

    messageList.appendChild(chatItem)
    window.scrollTo(0, document.body.scrollHeight);
})

const colors = document.querySelector('.colors');
colors.addEventListener('click', (e) => {
    if(e.target.tagName === "BUTTON") {

        if(document.querySelector('.selected')) {
            document.querySelector('.selected').classList.remove('selected')
        }

        e.target.classList.add('selected');
        socket.emit('text color', e.target.dataset.color);
    }
})

const emojies = document.querySelector('.emojies')

emojies.addEventListener('click', e => {
    messageInput.value += e.target.textContent;
})

messageInput.addEventListener('input', () => {
    socket.emit('typing server')

})

socket.on('typing client', data => {
    let value = messageInput.value;
    setTimeout(() => {
        if(value === messageInput.value) {
            document.querySelector('.typing').remove()
        }
    }, 1600)

    if(document.querySelector('.typing')) {
        return;
    }
    const messageList = document.querySelector('.message-area');
    const chatItem = document.createElement('li');
    chatItem.style.color = "grey"
    chatItem.className = "typing"
    chatItem.textContent = `${data.user} печатает...`
    messageList.appendChild(chatItem)


})