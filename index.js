const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Serve frontend files
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Socket connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (username) => {
    socket.username = username;
    console.log(`${username} joined the chat`);
  });

  socket.on("chat message", (data) => {
    // Send the user's message to all
    io.emit("chat message", {
      user: data.user,
      message: data.message,
    });

    // Basic bot logic
    const userMsg = data.message.toLowerCase();
    let botReply = "";

    // Custom replies
    if (userMsg.includes("how are you") || userMsg.includes("how r u")) {
      botReply = "I'm fine, thank you!";
    } else if (userMsg.includes("hi") || userMsg.includes("hello")) {
      botReply = "Hello there! 👋";
    } else if (userMsg.includes("bye")) {
      botReply = "Goodbye! Have a nice day 😊";
    } else if (userMsg.includes("?") || userMsg.length > 1) {
      // Generic response to any question or sentence
      botReply = "I’m just a simple bot, but I’m listening 😊";
    }

    // Reply with delay
    if (botReply) {
      setTimeout(() => {
        io.emit("chat message", {
          user: "🤖 Bot",
          message: botReply,
        });
      }, 1000);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
