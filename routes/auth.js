/*
    Rutas de usuarios / Auth
    host + /api/auth
*/
const { Router } = require("express");  // 6 configuracion de rutas
const { check } = require("express-validator");
const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
} = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const router = Router(); // 7 configuracion de rutas
const { validarJWT } = require("../middlewares/validar-jwt");

//middlewares
router.post(
  "/new",
  [
    //middlewares
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe ser mayor a 5 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  crearUsuario
);
router.post(
  "/",
  [
    //middlewares
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe ser mayor a 5 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  loginUsuario
);

router.get("/renew", validarJWT, revalidarToken);

module.exports = router;
