
const express = require('express')
const app = express()
const port = 5000
const socket = require("socket.io");

//const cors = require("cors")
//app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World 11!')
})

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const io = socket(server, {
  cors: {
    origin: '*'
  }
  ,path:'/api/socket.io'
});

const activeUsers = new Set()

io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on("username", function (data) {
    socket.username = data;
    activeUsers.add(data);
    io.emit("new_user", {'user':data, 'users':[...activeUsers]});
    socket.emit("users", [...activeUsers])
    console.log('user connected', socket.username, activeUsers.size)
  });

  socket.on("message", function(data) {
    io.emit("new_message", {'user':socket.username, 'message': data});
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.username);
    io.emit("user_disconnected", {'user':socket.username, 'users': [...activeUsers]});
    console.log('user disconnected', socket.username, activeUsers.size)
  });
});
