import Users from '../models/user.js'
import generarJWT from "../helpers/JWT.js"
import jwt from 'jsonwebtoken'
import sendMailToUser from '../config/nodemailer.js'


const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (Object.values(req.body).includes("")) {
      return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    const userBDD = await Users.findOne({ email }).select("+password");

    if (!userBDD) {
      return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
    }

    const verificarPassword = await userBDD.matchPassword(password);

    if (!verificarPassword) {
      return res.status(400).json({ msg: "Lo sentimos, la contraseña no es correcta" });
    }

    const { nombre, apellido, rol, telefono, area, _id, email: userEmail } = userBDD;

    const token = generarJWT(_id, "usuario");

    res.status(200).json({
      nombre,
      apellido,
      token,
      _id,
      rol,
      email: userEmail,
      telefono,
      area
    });

  } catch (error) {
    console.error("Error en loginUsuario:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};


const registroUsuario = async (req,res) => {
    const {email, nombre} = req.body
    if(Object.values(req.body).includes("")) return res.status(400),json({msg:"Lo sentimos, debes llenar todos los campos"})
    
    const verificarEmailBDD = await Users.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, ese email ya esta registrado"})
    
    const contrasenaTemporal = Math.random().toString(36).slice(-8)


    const nuevoUser = new Users(req.body)
    nuevoUser.password = await nuevoUser.encrypPassword(contrasenaTemporal)
    console.log(contrasenaTemporal)

    const token = jwt.sign({ email: nuevoUser.email }, process.env.JWT_SECRET, { expiresIn: '1h'})

    try{
        await nuevoUser.save()

        sendMailToUser(email, contrasenaTemporal, token, nombre)

        res.status(200).json({msg:"Usuario registrado exitosamente y correo enviado"})

    }catch(error){
        console.error(error)
        res.status(500).json({ error: 'Error al registrar el usuario o enviar el correo' });
    }

    
}

const perfilUsuario = async (req, res) => {
    try {
        const id  = req.user._id;
    
        const usuario = await Users.findById(id).select('nombre apellido rol area');
    
        if (!usuario) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    
        res.status(200).json(usuario);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }  

const listarUsuarios = async (req,res) => {
    const user = await Users.find()
    res.status(200).json(user)
}

const listarAreasUnicas = async (req, res) => { //revisar si se esta haciendo uso
    try {
        const areas = await Users.distinct('area');
        res.status(200).json(areas);
    } catch (error) {
        console.error('Error al listar áreas únicas:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const nuevaPassword = async (req, res) => {
    try {
        const { cedula } = req.params;
        const { passwordnuevo, repetirpassword } = req.body;

        // Validaciones básicas
        if (!passwordnuevo || !repetirpassword) {
            return res.status(400).json({ msg: "Debes ingresar y repetir la nueva contraseña" });
        }

        if (passwordnuevo !== repetirpassword) {
            return res.status(400).json({ msg: "Las contraseñas no coinciden" });
        }

        const usuarioBDD = await Users.findOne({ cedula });

        if (!usuarioBDD) {
            return res.status(404).json({ msg: `No existe un usuario con la cédula ${cedula}` });
        }

        usuarioBDD.password = await usuarioBDD.encrypPassword(passwordnuevo);
        await usuarioBDD.save();

        res.status(200).json({ msg: `Contraseña actualizada correctamente para el usuario con cédula ${cedula}` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error del servidor al actualizar la contraseña" });
    }
};

const cambiarPasswordTemporal = async (req,res) => {
    const { token } = req.params;
    const { passwordnuevo } = req.body;
  
    if (!passwordnuevo || passwordnuevo.length <= 6 || passwordnuevo.length >= 12) {
        return res.status(400).json({ msg: "La nueva contraseña debe tener entre 6 y 12 caracteres" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const usuarioBDD = await Users.findOne({ email: decoded.email });
  
      if (!usuarioBDD) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el usuario con email ${decoded.email}` });
      }
  
      usuarioBDD.password = await usuarioBDD.encrypPassword(passwordnuevo);
      await usuarioBDD.save();
  
      res.status(200).json({ msg: "Contraseña actualizada correctamente desde el enlace" });
    } catch (error) {
      return res.status(401).json({ msg: "Token inválido o expirado" });
    }
}


const actualizarUsuario = async(req, res) => {
    const { cedula } = req.params;

    const user = await Users.findOne({ cedula });

    if (!user) {
        return res.status(400).json({
            msg: `Lo sentimos, no existen coincidencias con la cédula ingresada: ${cedula}`
        });
    }

    const { telefono, area, rol, status } = req.body;

    if ([telefono, area, rol, status].includes("")) {
        return res.status(400).json({
            msg: "Lo sentimos, debes llenar todos los campos"
        });
    }

    await Users.updateOne({ cedula }, { telefono, area, rol, status });

    res.status(200).json({ msg: "Usuario actualizado correctamente" });
}

const eliminarUsuario = async(req,res) => {
    const {cedula} = req.params

    try {
        const user = await Users.findOneAndDelete({ cedula });

        if (!user) {
            return res.status(400).json({
                msg: `Lo sentimos, no existe ningún usuario con la cédula ingresada: ${cedula}`
            });
        }

        res.status(200).json({ msg: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al eliminar el usuario" });
    }
}

export {
    loginUsuario,
    registroUsuario,
    perfilUsuario,
    listarUsuarios,
    nuevaPassword,
    actualizarUsuario,
    eliminarUsuario,
    cambiarPasswordTemporal,
    listarAreasUnicas
}




