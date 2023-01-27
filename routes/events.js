/*
    Event Routes
    host + /api/events
*/
const { Router } = require("express"); // 6 importar rutas

const { validarCampos } = require("../middlewares/validar-campos"); // 22 importamos nuestra validación de campos que nos muestra el error (si lo hay) despues de los check o next si no hay error
const { validarJWT } = require("../middlewares/validar-jwt"); // 13 importar JWT
const router = Router(); // 7 renombrar rutas

const { check } = require("express-validator"); //21 importamos exprress validator para la validación mediante middleware

// Todas tiene que pasar por la validacion de JWT

const {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} = require("../controllers/events"); // 12 importar respuestas
const isDate = require("../helpers/isDate"); //23 importamos la funcion custom

router.use(validarJWT); // 14 agregar middleware con JWT

// Obtener eventos
router.get("/", getEventos); // 8 configuracion de rutas

// Crear un nuevo evento
router.post(
  "/",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "La fecha de inicio es obligatoria").custom(isDate),
    check("end", "La fecha de finalización es obligatoria").custom(isDate),
    validarCampos,
  ],
  crearEvento
); // 24 agregamos los check de validación y la validacion del campo

// Actualizar un nuevo evento
router.put(
  "/:id",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio es obligatoria").custom(isDate),
    check("end", "Fecha de finalización es obligatoria").custom(isDate),
    validarCampos,
  ],
  actualizarEvento
);

// Actualizar un nuevo evento
router.delete("/:id", eliminarEvento);

module.exports = router; // 9 exportar rutas
