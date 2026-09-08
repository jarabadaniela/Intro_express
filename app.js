require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const miPuerto = process.env.MIPUERTO || 3333;

// Middleware para formatear JSON y servir estáticos
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuración de Multer para imágenes de productos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `prod-${uniqueSuffix}${ext}`);
  }
});
const upload = multer({ storage });

// Rutas de archivos JSON
const pathProductos = path.join(__dirname, "datosProductos.json");
const pathAprendices = path.join(__dirname, "datosAprendices.json");

// Funciones auxiliares para lecturas/escrituras
const leerJSON = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf-8"));
const guardarJSON = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// Endpoint Raíz
app.get("/", (req, res) => {
  res.send("<h1>API REST - Productos & Aprendices SENA</h1>");
});

/* ==========================================================================
   CRUD: APRENDICES (/api/aprendices)
   ========================================================================== */

// 1. GET: Listar todos los aprendices
app.get("/api/aprendices", (req, res) => {
  const aprendices = leerJSON(pathAprendices);
  res.json(aprendices);
});

// 2. GET: Obtener un aprendiz por ID
app.get("/api/aprendices/:id", (req, res) => {
  const aprendices = leerJSON(pathAprendices);
  const aprendiz = aprendices.find((a) => a.id === parseInt(req.params.id));
  if (!aprendiz) return res.status(404).json({ mensaje: "Aprendiz no encontrado" });
  res.json(aprendiz);
});

// 3. POST: Crear un aprendiz
app.post("/api/aprendices", (req, res) => {
  const { nombre, documento, ficha, email } = req.body;

  if (!nombre || !documento || !ficha || !email) {
    return res.status(400).json({ mensaje: "Todos los campos (nombre, documento, ficha, email) son obligatorios" });
  }

  const aprendices = leerJSON(pathAprendices);
  const nuevoAprendiz = {
    id: aprendices.length ? aprendices[aprendices.length - 1].id + 1 : 1,
    nombre,
    documento,
    ficha,
    email
  };

  aprendices.push(nuevoAprendiz);
  guardarJSON(pathAprendices, aprendices);
  res.status(201).json(nuevoAprendiz);
});

// 4. PUT: Actualizar un aprendiz por ID
app.put("/api/aprendices/:id", (req, res) => {
  const { nombre, documento, ficha, email } = req.body;
  const aprendices = leerJSON(pathAprendices);
  const index = aprendices.findIndex((a) => a.id === parseInt(req.params.id));

  if (index === -1) return res.status(404).json({ mensaje: "Aprendiz no encontrado" });
  if (!nombre || !documento || !ficha || !email) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  aprendices[index] = {
    ...aprendices[index],
    nombre,
    documento,
    ficha,
    email
  };

  guardarJSON(pathAprendices, aprendices);
  res.json(aprendices[index]);
});



// 5. DELETE: Eliminar un aprendiz por ID
app.delete("/api/aprendices/:id", (req, res) => {
  let aprendices = leerJSON(pathAprendices);
  const existe = aprendices.some((a) => a.id === parseInt(req.params.id));

  if (!existe) return res.status(404).json({ mensaje: "Aprendiz no encontrado" });

  aprendices = aprendices.filter((a) => a.id !== parseInt(req.params.id));
  guardarJSON(pathAprendices, aprendices);
  res.json({ mensaje: "Aprendiz eliminado correctamente" });
});

/* ==========================================================================
   CRUD: PRODUCTOS (/api/productos)
   ========================================================================== */

app.get("/api/productos", (req, res) => {
  res.json(leerJSON(pathProductos));
});

app.get("/api/productos/:id", (req, res) => {
  const productos = leerJSON(pathProductos);
  const producto = productos.find((p) => p.id === parseInt(req.params.id));
  if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });
  res.json(producto);
});

app.post("/api/productos", upload.single("imagen"), (req, res) => {
  const { nombre, precio, stock, categoria } = req.body;
  if (!nombre || precio === undefined || stock === undefined || !categoria) {
    return res.status(400).json({ mensaje: "Todos los campos obligatorios deben diligenciarse" });
  }

  const productos = leerJSON(pathProductos);
  const nuevaRutaImagen = req.file ? `/uploads/${req.file.filename}` : null;

  const nuevoProducto = {
    id: productos.length ? productos[productos.length - 1].id + 1 : 1,
    nombre,
    precio: Number(precio),
    stock: Number(stock),
    categoria,
    imagen: nuevaRutaImagen
  };

  productos.push(nuevoProducto);
  guardarJSON(pathProductos, productos);
  res.status(201).json(nuevoProducto);
});

app.put("/api/productos/:id", upload.single("imagen"), (req, res) => {
  const { nombre, precio, stock, categoria } = req.body;
  const productos = leerJSON(pathProductos);
  const index = productos.findIndex((p) => p.id === parseInt(req.params.id));

  if (index === -1) return res.status(404).json({ mensaje: "Producto no encontrado" });
  if (!nombre || precio === undefined || stock === undefined || !categoria) {
    return res.status(400).json({ mensaje: "Todos los campos obligatorios deben diligenciarse" });
  }

  const imagenExistente = productos[index].imagen;
  const nuevaRutaImagen = req.file ? `/uploads/${req.file.filename}` : imagenExistente;

  productos[index] = {
    ...productos[index],
    nombre,
    precio: Number(precio),
    stock: Number(stock),
    categoria,
    imagen: nuevaRutaImagen
  };

  guardarJSON(pathProductos, productos);
  res.json(productos[index]);
});

app.delete("/api/productos/:id", (req, res) => {
  let productos = leerJSON(pathProductos);
  const existe = productos.some((p) => p.id === parseInt(req.params.id));
  if (!existe) return res.status(404).json({ mensaje: "Producto no encontrado" });

  productos = productos.filter((p) => p.id !== parseInt(req.params.id));
  guardarJSON(pathProductos, productos);
  res.json({ mensaje: "Producto eliminado correctamente" });
});

//endpoint para provocar un error
app.get("/Error", (req, res, next)=>{
    next(new Error("Error provocado, intencional"))
})

app.listen(miPuerto, () => {
  console.log(`SERVIDOR: http://localhost:${miPuerto}`);
});
