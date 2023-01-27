const { response } = require("express"); // 10 importar respuestas
const Evento = require("../models/Evento"); // 16 importamos nuestro modelo para agregarlo a la base de datos

const getEventos = async (req, res = response) => {
  const eventos = await Evento.find().populate("user", "name");

  res.json({
    ok: true,
    eventos,
  });
}; // 11 configurar respuestas

const crearEvento = async (req, res = response) => {
  // Verificar que tiene el evento
  // console.log(req.body);

  const evento = new Evento(req.body); // 17 agregamos un nuevo Evento con lo que nos envian en la req

  try {
    evento.user = req.uid;
    const eventoGuardado = await evento.save();
    res.status(400).json({
      ok: true,
      msg: eventoGuardado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarEvento = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventoId);
    // console.log(evento)

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe con ese id",
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene permiso para editar este evento",
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: uid,
    };

    const eventoEliminado = await Evento.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      { new: true }
    );

    res.json({
      ok: true,
      msg: eventoEliminado,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarEvento = async(req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventoId);
    // console.log(evento)

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe con ese id",
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene permiso para eliminar este evento",
      });
    }


    const eventoEliminado = await Evento.findByIdAndDelete(eventoId);

    res.json({
      ok: true,
      msg: 'Evento eliminado con exito',
      event: eventoEliminado
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
