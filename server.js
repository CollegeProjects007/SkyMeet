const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const PORT = process.env.PORT || 3005;

// your code

const path = require('path');

app.set('view engine','ejs')
// => Here we expose the views so it can be rendered.
app.set('views', path.join(__dirname, 'views'));
// => Here we expose your dist folder
app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res)=>{
    res.redirect('/home')
})
app.get('/home',(req,res) =>{
    res.render('homepage')
})
app.get('/room',(req,res) =>{
    res.redirect(`/room/${uuidV4()}`)
})
app.get('/room/:room',(req,res)=>{
    res.render('room',{ roomId: req.params.room})
})
io.on('connection',socket =>{
    socket.on('join-room',(roomId, userId)=>{
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected', userId)

        socket.on("disconnect", ()=>{
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        })
    })
})

// server.listen(3005)
server.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });