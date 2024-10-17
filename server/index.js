const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");


const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})

io.on('connection', socket => {   //this event is fired when client successfully connect to the server
    console.log(`User ${socket.id} connected`)   //every socket connection gets its on id which we here are treating as user id

    //Upon connection only to user

    socket.emit('message', "Welcome to the chat app")

    //Upon connection to all others except the users that just connected on its browser

    socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} connected`)

    // listening for a message event from client and show them on both of browser the one who sends it and the one who recieves it
    socket.on('message', data => {
        console.log(data)
        io.emit('message', `${socket.id.substring(0, 5)}: ${data}`)  //emit is used to to show the message the one who send it and the one who recieves it
    })

    //listening to an event when all others disconnect

    socket.on('disconnect', () => {
        socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} disconnected `)  //broadcast the discooned message to all others when users disconnected expect itslef
    });

    //listening to an event when someone is tying expect the one who is typing

    socket.on('activity', (name) => {
        socket.broadcast.emit('activity', name)  // this listen event from client and broadcast it all other connected users
    })
})



server.listen(3500, () => console.log('listening on port 3500'))