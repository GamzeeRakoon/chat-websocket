import "./styles.css"

const socket = io();

const clientsTotal = document.getElementById("clients-total");

const messageContainer = document.getElementById("message-container");
const messageItems = document.getElementById("message-items");
const nameInput = document.getElementById("name-input");
const mesasgeForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

const clearFeedback = () => {
    const messageList = document.getElementById('message-items');

    // Check if the ul element with id 'message-items' exists
    if (messageList) {
        console.log('we\'re in');
        const feedbackItems = messageList.querySelectorAll('.message-feedback');
        console.log(feedbackItems);

        feedbackItems.forEach(feedbackItem => {
            console.log('Removing element:', feedbackItem);
            feedbackItem.remove();
        });
    }
};

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

const scrollToBottom = () => {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

const addMessageToUI = (isOwnMessage, data) => {
    clearFeedback()
    const formattedDateTime = formatDateTime(data.dateTime);
    const element = `
                    <li class="chat ${isOwnMessage ? 'chat-end' : 'chat-start'}">
                        <p class="chat-bubble">
                            ${data.message}
                            <span class="text-xs italic"><br >${data.name} * ${formattedDateTime}</span>
                        </p>
                    </li>
                    `
    messageItems.innerHTML += element
    scrollToBottom()
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message...`
    })
})

messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message...`
    })
})

messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ``
    })
})


socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
                    <li class="message-feedback">
                        <p id="feedback" class="indicator-item badge badge-secondary">
                            ${data.feedback}
                        </p>
                    </li>
                    `
    messageItems.innerHTML += element
})