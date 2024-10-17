const socket = io('ws://localhost:3500');

const activity = document.querySelector('.activity');
const msgInput = document.querySelector('input');

// Add a listener for the welcome message
socket.on('message', (data) => {
    const li = document.createElement('li');
    li.textContent = data;
    document.querySelector('ul').appendChild(li);
});

// Handle incoming messages
socket.on('welcome', (data) => {
    const li = document.createElement('li');
    li.textContent = data; // This will be "Welcome to the chat app"
    document.querySelector('ul').appendChild(li);
});

function sendMessage(e) {       //function to send a message 
    e.preventDefault();
    if (msgInput.value) {
        socket.emit('message', msgInput.value);
        msgInput.value = "";
    }
    msgInput.focus();
}

document.querySelector('form').addEventListener('submit', sendMessage);

// Handle typing activity
msgInput.addEventListener('keypress', () => {
    socket.emit('activity', socket.id.substring(0, 5));
});

let activityTimer;
socket.on("activity", (name) => {
    activity.textContent = `${name} is typing...`;

    // Clear after 3 seconds 
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
        activity.textContent = "";
    }, 3000);
});
