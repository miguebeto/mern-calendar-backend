const { response } = require("express"); //para no perder la ayuda de vscode
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario"); // 16 importamos el esquema de los usuarios
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    //validacion personalizada para usuario existente
    let usuario = await Usuario.findOne({ email });
    // console.log(usuario);

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario ya existe con ese correo",
      });
    }

    usuario = new Usuario(req.body); // 17 agregamos un nuevo usuario con lo que nos envian en la req

    // 18 Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // 19 gurdamos el usurio en la base de datos
    await usuario.save();

    // 20 Generar nuestro JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
      // msg: "registro",
      // email,
      // password,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }

  // Manejo de errores
  // if (name.length < 5) {
  //   return res.status(400).json({
  //     ok: false,
  //     msg: "el nombre debe ser mayor a 4 letras",
  //   });
  // }
  // console.log(errors);
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario existe con ese email",
      });
    }

    // Confirmar los password
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña incorrecta",
      });
    }

    //Generar JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      email: usuario.name,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const revalidarToken = async (req, res = response ) => {

  const { uid, name } = req;

  // Generar JWT
  const token = await generarJWT( uid, name );

  res.json({
      ok: true,
      // uid,name,
      token
  })
}

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
