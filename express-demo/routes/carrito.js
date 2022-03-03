const express = require("express");
const { redirect } = require("express/lib/response");
const {Router} = express;
const routerCarrito = Router();
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const routerProductos = require('./productos').pro
const arrayProductos = require('./productos').arr


class Carrito{
  constructor(id,nombre,stock,precio){
    this.id=id;
    this.timestamp=timestamp;
    this.productos=[];
  }
}

routerCarrito.get("/",(req,res)=>{
  res.render("productos",{arrayProductos:arrayProductos});
})

routerCarrito.get("/:id",(req,res)=>{
  const {id} = req.params
  const producto = arrayProductos.find(m=> m.id == id)
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
  const {nombre,stock,precio} = req.body
  let biggestId = 0;
  if (arrayProductos) {
    arrayProductos.forEach(element => {
      if (element.id>biggestId) {
        biggestId = element.id;
      }
    });
  }
  biggestId++
  const producto = new Producto(biggestId,nombre,stock,precio)
  arrayProductos.push(producto)
  res.sendStatus(201)
  res.send(arrayProductos.find(m=> m.id == biggestId))
})

routerCarrito.put("/:id",(req,res)=>{
  const {id} = req.params
  const producto = arrayProductos.find(m=> m.id == id)
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
  const producto = arrayProductos.find(m=> m.id == id)
  if (!producto) {
    res.status(404).send({
      error:"Producto no encontrado"
    })
    return
  }
  const index = arrayProductos.indexOf(producto)
  arrayProductos.splice(index,1)
  res.sendStatus(200)
})

module.exports.carr = routerCarrito;