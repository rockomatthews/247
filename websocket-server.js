const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: "*",
  credentials: true
}));

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store comments in memory (use database in production)
let comments = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send existing comments to new user
  socket.emit('initialComments', comments);

  // Handle new comment
  socket.on('newComment', (comment) => {
    const newComment = {
      id: Date.now().toString(),
      username: comment.username,
      message: comment.message,
      timestamp: new Date()
    };

    // Add to comments array
    comments.push(newComment);

    // Keep only last 100 comments
    if (comments.length > 100) {
      comments = comments.slice(-100);
    }

    // Broadcast to all connected clients
    io.emit('comment', newComment);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

module.exports = app;