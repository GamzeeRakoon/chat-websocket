import "./styles.css"

const socket = io();

const clientsTotal = document.getElementById("clients-total");

const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const mesasgeForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

mesasgeForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total clients: ${data}`
});

const sendMessage = () => {
    console.log(messageInput.value)

    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }
    socket.emit('message', data)
}

socket.on('chat-message', (data) => {
    console.log(data)
});