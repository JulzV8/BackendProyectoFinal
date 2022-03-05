const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')
const app = express()
const arrayProductos = require('./routes/productos').arr
const addProdu = require('./routes/productos').addProducto


app.use(express.json())
app.use(express.urlencoded({extended: true}))

const server = http.createServer(app)
const io = new Server(server)
const fs = require("fs");
const { loadavg } = require("os");
const container = require("./container")

const contenedor = new container("./chat.txt")

const PORT = process.env.PORT || 8080
const handlebars = require("express-handlebars")

app.engine("jev",handlebars.engine({
  extname: ".jev",
  defaultLayout: "index.jev",
  layoutsDir: __dirname + "/views",
  partialsDir: __dirname + "/views"
}));

app.set('view engine','jev');
app.set('views','./views');

app.use("/static", express.static(path.join(__dirname, 'public')))

const routerCarrito = require('./routes/carrito').carr
app.use("/carrito/",routerCarrito)
const routerProductos = require('./routes/productos').pro
app.use("/productos/",routerProductos)

let messages = [];

server.listen(PORT, ()=>{
  console.log(`escuchando ${PORT}`);
})
io.on('connection', (socket) => {
  console.log(`an user connected: ${socket.id}`)
  arrayProductos.forEach(element => {
    socket.emit("producto",element)
  });
  contenedor.getAll()
  .then((data)=>{
    messages=data
    socket.emit('messages', messages);
  })
  
  socket.on("aniadirProducto",(nombre,stock,precio)=>{
    const element = addProdu(nombre,stock,precio)
    io.sockets.emit("producto",element)
  })

  socket.on('new-message',data => {
    messages.push(data);
    contenedor.save(data)
    io.sockets.emit('messages', messages);
});
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')))

server.on("error",(err)=>{
  console.log(`Error: ${err}`);
})
