const express = require("express");
const { redirect } = require("express/lib/response");
const {Router} = express;
const routerProductos = Router();
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

class Producto{
  constructor(id,nombre,stock,precio){
    this.id=id;
    this.nombre=nombre;
    this.stock=stock;
    this.precio=precio;
  }
}

function addProducto(nombre,stock,precio,array) {
  let biggestId = 0;
  if (array.length) {
    array.forEach(element => {
      if (element.id>biggestId) {
        biggestId = element.id;
      }
    });
  }
  biggestId++
  const producto = new Producto(biggestId,nombre,stock,precio)
  array.push(producto)
  return producto;
}

let arrayProductos = [ 
  new Producto(1,"hotwheels",20,250),
  new Producto(2,"max-steel",5,900),
  new Producto(3,"woody",10,1275)
]

routerProductos.get("/",(req,res)=>{
  res.render("productos",{arrayProductos:arrayProductos});
})

routerProductos.get("/:id",(req,res)=>{
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

routerProductos.post("/",(req,res)=>{
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
  // res.sendStatus(201)
  res.send(arrayProductos.find(m=> m.id == biggestId))
})

routerProductos.put("/:id",(req,res)=>{
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

routerProductos.delete("/:id",(req,res)=>{
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

module.exports.pro = routerProductos;
module.exports.arr = arrayProductos;

