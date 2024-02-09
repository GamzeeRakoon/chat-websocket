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
    if (messageInput.value == '') return

    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }
    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = '';
}

socket.on('chat-message', (data) => {
    console.log(data);
    addMessageToUI(false, data);
});

function formatDateTime(dateTime) {
    const options = {month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateTime));
}

const addMessageToUI = (isOwnMessage, data) => {
    const formattedDateTime = formatDateTime(data.dateTime);
    const element = `
                    <li class="chat ${isOwnMessage ? 'chat-end' : 'chat-start'}">
                        <p class="chat-bubble">
                            ${data.message}
                            <span class="text-xs italic"><br >${data.name} * ${formattedDateTime}</span>
                        </p>
                    </li>
                    `
    messageContainer.innerHTML += element
}