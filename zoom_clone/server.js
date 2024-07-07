const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require('socket.io')(server);
const path = require('path');
const { ExpressPeerServer } = require('peer');
const peersServer = ExpressPeerServer(server, { debug: true });
const { v4: uuidv4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use('/peerjs', peersServer);

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.set("views", path.join(__dirname, "views"));

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    // Join the specified room
    socket.join(roomId);

    // Emit the 'user-connected' event to all clients in the room except the sender
    socket.to(roomId).emit('user-connected', userId);

    // Listen for screen sharing events and broadcast them
    socket.on('screen-share', (streamId) => {
      socket.to(roomId).emit('user-screen-share', streamId);
    });

    socket.on('message', message => {
      io.to(roomId).emit('create-message', message);
    });

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

server.listen(8888, () => {
  console.log('Server is running on port 8888');
});
