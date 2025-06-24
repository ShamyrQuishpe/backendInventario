import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

const router = Router()

import {
    loginUsuario,
    registroUsuario,
    perfilUsuario,
    listarUsuarios,
    nuevaPassword,
    eliminarUsuario,
    actualizarUsuario,
    cambiarPasswordTemporal,
    listarAreasUnicas
} from '../controllers/user_controller.js' 

router.post('/login', loginUsuario) //Monica Miguel

router.post('/registro',autenticar, verificarRol('Administrador'), registroUsuario) //Monica

router.get('/perfil', autenticar, perfilUsuario) //Monica Miguel

router.get('/users',autenticar, verificarRol('Administrador'), listarUsuarios) //Monica 

router.get('/areasunicas', autenticar, listarAreasUnicas) //Miguel

router.put('/nuevapassword/:cedula',autenticar, verificarRol('Administrador'), nuevaPassword) //Monica

router.put('/cambiar-contrasena/:token', cambiarPasswordTemporal); //Monica

router.put('/users/:cedula',autenticar, verificarRol('Administrador'), actualizarUsuario) //Monica

router.delete('/users/:cedula',autenticar, verificarRol('Administrador'), eliminarUsuario) //Monica

export default router
