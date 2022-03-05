const express = require("express");
const { redirect } = require("express/lib/response");
const {Router} = express;
const routerProductos = Router();
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

function conseguirFecha(){
  const fecha = new Date();
  const day = String(fecha.getDate()).padStart(2, '0');
  const month = fecha.getMonth()+1;
  const year = fecha.getFullYear();
  const hour = fecha.getHours();
  const minute = fecha.getMinutes();
  const second = fecha.getSeconds();

  return `[${day}/${month}/${year}/  ${hour}:${minute}:${second}:]`
}

module.exports.fecha =  conseguirFecha();

class Producto{
  constructor(id,nombre,descripcion,codigo,foto,precio,stock){
    this.id=id;
    this.timestamp=conseguirFecha();
    this.nombre=nombre;
    this.descripcion=descripcion;
    this.codigo=codigo;
    this.foto=foto;
    this.precio=precio;
    this.stock=stock;
  }
}

let arrayProductos = [ 
  new Producto(1,"hotwheels",20,250),
  new Producto(2,"max-steel",5,900),
  new Producto(3,"woody",10,1275)
]

exports.addProducto = function (nombre,stock,precio) {
  let biggestId = 0;
  if (arrayProductos.length) {
    arrayProductos.forEach(element => {
      if (element.id>biggestId) {
        biggestId = element.id;
      }
    });
  }
  biggestId++
  const producto = new Producto(biggestId,nombre,stock,precio)
  arrayProductos.push(producto)
    return producto;
}

routerProductos.get("/",(req,res)=>{
  res.send(arrayProductos);
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
  const {nombre,stock,precio,admin} = req.body
  if (admin) {
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
  }else{
    res.status(403).send({
      error:"Acceso denegado"
    })
  }
})

routerProductos.put("/:id",(req,res)=>{
  const {id,admin} = req.params
  const producto = arrayProductos.find(m=> m.id == id)
  if (!producto) {
    res.status(404).send({
      error:"Producto no encontrado"
    })
    return
  }
  if (admin) {
    
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
  }
  else{
    res.status(403).send({
      error:"Acceso denegado"
    })
  }
})

routerProductos.delete("/:id",(req,res)=>{
  const {id,admin} = req.params
  const producto = arrayProductos.find(m=> m.id == id)
  if (!producto) {
    res.status(404).send({
      error:"Producto no encontrado"
    })
    return
  }
  if (admin) {
    const index = arrayProductos.indexOf(producto)
    arrayProductos.splice(index,1)
    res.sendStatus(200)
  }else{
    res.status(403).send({
      error:"Acceso denegado"
    })
  }
})

module.exports.pro = routerProductos;
module.exports.arr = arrayProductos;

