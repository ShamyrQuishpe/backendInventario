import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

const router = Router()

import {
    loginUsuario,
    registroUsuario,
    perfilUsuario,
    listarUsuarios,
    detalleUsuario,
    nuevaPassword,
    eliminarUsuario,
    actualizarUsuario,
    cambiarPasswordTemporal,
    listarAreasUnicas
} from '../controllers/user_controller.js' 

router.post('/login', loginUsuario)

router.post('/registro',autenticar, verificarRol('Administrador'), registroUsuario)

router.get('/perfil', autenticar, perfilUsuario)

router.get('/users',autenticar, verificarRol('Administrador'), listarUsuarios)

router.get('/users/:cedula',autenticar, verificarRol('Administrador'), detalleUsuario)

router.get('/areasunicas', listarAreasUnicas)

router.put('/users/nuevapassword',autenticar, verificarRol('Administrador'), nuevaPassword)

router.put('/cambiar-contrasena/:token', cambiarPasswordTemporal);

router.put('/users/:cedula',autenticar, verificarRol('Administrador'), actualizarUsuario)

router.delete('/users/:cedula',autenticar, verificarRol('Administrador'), eliminarUsuario)

//Faltan endpoints para los procesos como tal

export default router
