const express = require("express"); // 1
const { dbConnection } = require("./database/config");
const cors = require("cors");
require("dotenv").config();

// console.log(process.env);

// crear servido de express
const app = express(); // 2

// Base de datos
dbConnection();

//CORS
app.use(cors());

// Directorio Público
app.use(express.static("public")); // 3 para mandar html

// Lectura y parseo del body
app.use(express.json()); // 3 para devolver respuestas en json

// Rutas
// app.get("/", (req, res) => {
//   console.log("se requiere el /");
//   res.json({
//     ok: true,
//   });
// });

app.use("/api/auth", require("./routes/auth")); // 4 middlewares de express para mostrar contenido de carpeta auth segun la ruta establecida
app.use("/api/events", require("./routes/events")); //4 middlewares de express para mostrar contenido de carpeta auth segun la ruta establecida

// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
}); // 5 configuracion del puerto
