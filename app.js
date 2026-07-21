import express from "express";
//import {configDotenv} from "dotenv"
//configDotenv();
import "dotenv/config";

/* const express = require("express") */
const app = express();
const puerto = process.env.PORT || 3500;

app.get("/",(req,res)=>{
    res.send("Hola ficha 3407180 Daniela");     
});

app.get("/misaludo:ficha",(req,res)=>{
    const ficha= req.params.ficha;
    res.send(`<h1>Saludo</h1><p>Hola soy Nani de la ficha ${ficha} </p>`);     
});

app.get("/clientes/:id",(req,res)=>{
    const id = req.params.id;
    res.send(`<h1>Clientes</h1><p>Soy el cliente con ID ${id} </p>`);     
});


app.listen(puerto, ()=>{
    console.log(`SERVIDOR http://localhost:${puerto}
        http://127.0.0.1:${puerto}`); 
});