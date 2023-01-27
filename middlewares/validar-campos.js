const { response } = require("express");
const { validationResult } = require("express-validator"); // 22 importamos nuestra validación de campos que nos muestra el error (si lo hay) despues de los check o next si no hay error


const validarCampos = (req, res = response, next) => {
  // Manejo de errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }

  next();
};


module.exports = {
    validarCampos
}