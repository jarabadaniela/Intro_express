const manejoErrores = (err, req, res, next)=>{
    const codigoEstado = err.statusCode || 500
    const mensaje = err.message || "Error inesperado,"
    console.log(['Fecha', fecha -'Estado:', codigoEstado - 'Mensaje:', mensaje])
    //otra parte de mensajes de error
    if(err.stack){
        console.error(err.stack)
    }
    //respuesta del servidor
    res.status(codigoEstado).json({
        Estado: 'error',
        mensaje,
        //mas detalles cuando somos desarrolladores
        ...(process.env.NODE_ENV === 'development' && {stack: err.stack})
    })

}

module.exports = manejoErrores