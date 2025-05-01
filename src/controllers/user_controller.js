import Users from '../models/user.js'
import mongoose from 'mongoose'
import generarJWT from "../helpers/JWT.js"
import bcrypt from 'bcryptjs'; 

const loginUsuario = async (req, res) => {
    const {email, password} = req.body
    if(Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const userBDD = await Users.findOne({email}).select("-status -__v -updatedAt -createdAt")
    if(!userBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"}) 
    const verificarPassword = await userBDD.matchPassword(password)
    if(!verificarPassword) return res.status(400).json({msg:"Lo sentimos, la contrasena no es correcta"})
    
    const {nombre, apellido,rol, telefono, area, estado, _id }  = userBDD
    const token = generarJWT(userBDD._id, "usuario")
    
    console.log(userBDD)
    
    res.status(200).json({
        nombre,
        apellido,
        token,
        _id,
        rol,
        email: userBDD.email
    })
}

const registroUsuario = async (req,res) => {
    const {email, password} = req.body
    if(Object.values(req.body).includes("")) return res.status(400),json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await Users.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, ese email ya esta registrado"})
    const nuevoUser = new Users(req.body)
    nuevoUser.password = await nuevoUser.encrypPassword(password)
    
    const token = nuevoUser.crearToken()
    await nuevoUser.save()
    
    res.status(200).json({msg:"Usuario registrado exitosamente"})
}

const perfilUsuario = (req, res) => {
    if (!req.user) {
        return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const usuario = { ...req.user };
    delete usuario.token
    delete usuario.__v;
    res.status(200).json(usuario);
};
  

const listarUsuarios = async (req,res) => {
    const user = await Users.find()
    res.status(200).json(user)
}

const detalleUsuario = async (req,res) => { //revisar para buscar por correo o bien agregar cedula
    const {cedula} = req.params

    const user = await Users.findOne({cedula})

    if(!user) return res.status(400).json({msg: `Lo sentimos no existe coincidencias con la cedula ingresada: ${cedula}` })
    
    res.status(200).json(user)
}

const nuevaPassword = async (req, res) => {

    if (!req.user || !req.user._id) {
        return res.status(401).json({ msg: "No estás autenticado o falta el usuario" });
    }

    const usuarioBDD = await Users.findById(req.user._id);

    if (!usuarioBDD) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el usuario ${req.user._id}` });
    }

    const verificarPassword = await usuarioBDD.matchPassword(req.body.passwordactual);

    if (!verificarPassword) {
        return res.status(400).json({ msg: "Lo sentimos, el password actual no es el correcto" });
    }

    usuarioBDD.password = await usuarioBDD.encrypPassword(req.body.passwordnuevo);

    await usuarioBDD.save();

    res.status(200).json({ msg: "Password actualizado correctamente" });
};


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
    detalleUsuario,
    nuevaPassword,
    actualizarUsuario,
    eliminarUsuario
}




