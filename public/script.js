const socket = io("https://your-backend.onrender.com");

let username = "";

// Elements
const loginBox = document.getElementById("loginBox");
const chatBox = document.getElementById("chatBox");
const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("usernameInput");
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

// Join chat with username
loginBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  if (username) {
    socket.emit("join", username);
    loginBox.style.display = "none";
    chatBox.style.display = "block";
  }
});

// Send message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", {
      user: username,
      message: input.value
    });
    input.value = "";
  }
});

// Receive message
socket.on("chat message", (data) => {
  const item = document.createElement("li");
  item.textContent = `[${data.user}]: ${data.message}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});
