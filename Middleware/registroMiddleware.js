const registroMiddleware = (req, res, next) => {
    const tiempomilisegundos = Date.now();
    const tiempoUTC= new Date().toISOString();
    //console.log(`Tiempo en milisegundos: ${tiempomilisegundos}, Tiempo UTC: ${tiempoUTC}`);
    // Aquí puedes agregar la lógica de tu middleware
    console.log(`[${tiempoUTC}:${req.method}-${req.url}-${req.ip}]`)
    next();

    res.on("finish", () => {
        const duracion = Date.now() - tiempomilisegundos;
        console.log(`tiempoUTC,'respuesta',res.statusCode,'duracion'+ 'ms'`);
    });
};

module.exports = registroMiddleware;