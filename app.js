const express = require("express")
require("dotenv").config()
const app = express()
  //configuracion de body-parse
app.use(express.json())
const sistemaArchivos = require("fs")
const ruta = require("path")
const { json } = require("stream/consumers")
const puerto = process.env.PORT || 3000;

//importar la libreria multer 
const multer = require ("multer")

//configurar el lugar almacenamiento
const almacenamiento = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, "misImagenes/")
    },
    filename: (req, file, cb)=>{
        const extension = ruta
        cb(null, `${Date.now()}`)
    }
})

//configurar la accion de carga
const cargar

  //ruta de mi archivo json
  const rutaArchivojson = ruta.join(__dirname, "aprendices.json")

app.get("/", (req, res) => {
    res.send("<h1>Api Aprendices</h1>")
})

//listar aprendices

app.get("/api/aprendices", (req, res)=> {
    sistemaArchivos.readFile(rutaArchivojson, "utf-8", (error, datos) =>
    {
        if (error) {
            return res.status(500).json({ Error: "Error conexion bd."})
        }
        const listaAprendices = JSON.parse(datos)
        res.json(listaAprendices)
    })
})

//endpoint para adicionar
app.post("/api/aprendices", (req, res) => {
    //capturar los datos enviados
    const datosAprendiz = req.body
    sistemaArchivos.readFile(rutaArchivojson, "utf-8", (error, datos) =>
    {
        if (error) {
            return res.status(500).json({ Error: "Error conexion bd."})
        }
        const listaAprendices = JSON.parse(datos)
        //agregar a la lista javascrpit    
        listaAprendices.push(datosAprendiz)
        //escritura de archivo
        sistemaArchivos.writeFile(rutaArchivojson, JSON.stringify(listaAprendices, null, 2), (error) => {
            if (error) {
                return res.json({ Error: "No se puede registrar." })
            }
            res.status(201).json(datosAprendiz)
        })
        res.json(datosAprendiz)
    })
})

//endpoint para editar
app.put("api/aprendices/:di", (req, res) =>{
    const diAprendiz = req.params
    const datosAprendiz= req.body
    sistemaArchivos.readFile(rutaArchivojson, "utf-8", (error, datos) => {
        if (error) {
            return res.status(500).json({ Error: "Error de conexion bd."})
        }
        const listaAprendices = JSON.parse(datos)
          //Actualizar aprendiz
        listaAprendices = listaAprendices.map(aprendiz =>{
            return aprendiz.di === diAprendiz ? {...aprendiz, ...datosAprendiz} :
            aprendiz
        })
    })
})





app.listen(puerto, () => {
    console.log(`SERVIDOR http://localhost:${puerto}`)
})