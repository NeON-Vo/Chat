const express = require('express');
const app = express();

const path = require('path')

const server = require('http').createServer(app)
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000
 
app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

app.use(express.static(path.join(__dirname, "static")));
 
server.listen(PORT, () => {
   console.log('Server is running on port: ' + PORT);
});

io.on('connection', (socket) => {
 
   socket.on('disconnect', () => {
    io.emit('send message', {
        message: "Пользователь " + socket.username + " покинул чат",
        users: socket.server.engine.clientsCount
       })
   });
 
   socket.on('new message', (msg) => {
       io.emit('send message', {
        message: msg, 
        user: socket.username, 
        color: socket.color ?? "#D9D9D9"
    });
   });
 
   socket.on('new user', (usr) => {
       socket.username = usr;
       io.emit('send message', {
        message: "Доброго времени суток, " + socket.username + "!",
        users: socket.server.engine.clientsCount
       })
   });

   socket.on('text color', color => {
       socket.color = color;
   })

   socket.on('typing server', () => {
        socket.broadcast.emit('typing client', {
            user: socket.username
        })
   })
});

