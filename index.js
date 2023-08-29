const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 3001;
const NEW_ESCAPE_MESSAGE_EVENT = "newEscapeMessage";
const START_ESCAPE_EVENT = "startEscape";
const PING_SERVER_EVENT = "pingServer";

io.on("connection", socket => {
  console.log("A user connected:", socket.id);

  // Join a room
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_ESCAPE_MESSAGE_EVENT, data => {
    io.in(roomId).emit(NEW_ESCAPE_MESSAGE_EVENT, data);
  });

  socket.on(START_ESCAPE_EVENT, () => io.in(roomId).emit(START_ESCAPE_EVENT));

  socket.on(PING_SERVER_EVENT, () => io.in(roomId).emit(PING_SERVER_EVENT));

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
