const express = require('express');
// bring express into our app
const app = express();
//create app as an instance of express
const server = require('http').Server(app);
//create an http server using the app
const io = require('socket.io')(server);
//connect socket.io to the server

const { v4: uuidv4 } = require('uuid');
//whoot whoot unique ids

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId);
        })
        
    })
})

server.listen(3000);
//listen on port 3000;

