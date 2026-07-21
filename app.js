//import express from "express";//ES
const express = require("express")
const app = express();
const puerto = Process.env.PORT || 3000;

app.get("/",(req,res)=>{
    res.send("Hola ficha 3407180");     
});

app.listen(puerto, ()=>{
    console.log(`Servidor funcionando!! en el puerto ${spuerto}`);
});