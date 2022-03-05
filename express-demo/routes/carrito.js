const express = require("express");
const { redirect } = require("express/lib/response");
const {Router} = express;
const routerCarrito = Router();
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const routerProductos = require('./productos').pro
const arrayProductos = require('./productos').arr
const conseguirFecha = require('./productos').fecha

class Carrito{
  constructor(id,arrayProductos){
    this.id=id;
    this.timestamp=conseguirFecha;
    this.productos=arrayProductos;
  }
}

let arrayCarrito = [ 
  new Carrito(1,[{"nombre":"woody"},{"nombre":"shrek"}])
]

routerCarrito.get("/",(req,res)=>{
  res.render("carritos",{arrayCarrito:arrayCarrito});
})

routerCarrito.get("/:id",(req,res)=>{
  const {id} = req.params
  const producto = arrayCarrito.find(m=> m.id == id)
  if (!producto) {
    res.status(404).send({
      error:"Producto no encontrado"
    })
    return
  }
  res.send(producto)
})

routerCarrito.post("/",(req,res)=>{
  console.log(req.body);
  const {array} = req.body
  let biggestId = 0;
  if (array) {
    array.forEach(element => {
      if (element.id>biggestId) {
        biggestId = element.id;
      }
    });
  }
  biggestId++
  const carrito = new Carrito(biggestId,array)
  arrayCarrito.push(carrito)
  res.sendStatus(201)
})

routerCarrito.put("/:id",(req,res)=>{
  const {id} = req.params
  const producto = arrayCarrito.find(m=> m.id == id)
  if (!producto) {
    res.status(404).send({
      error:"Producto no encontrado"
    })
    return
  }
  const {nombre,stock,precio} = req.body
  if (nombre) {
    producto.nombre = nombre
  }
  if (stock) {
    producto.stock = stock
  }
  if (precio) {
    producto.precio = precio
  }
  res.sendStatus(200)
})

routerCarrito.delete("/:id",(req,res)=>{
  const {id} = req.params
  const producto = arrayCarrito.find(m=> m.id == id)
  if (!producto) {
    res.status(404).send({
      error:"Producto no encontrado"
    })
    return
  }
  const index = arrayCarrito.indexOf(producto)
  arrayCarrito.splice(index,1)
  res.sendStatus(200)
})

module.exports.carr = routerCarrito;