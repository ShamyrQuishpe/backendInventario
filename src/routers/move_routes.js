import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

import {
    registrarMovimiento,
    listarMovimientosPorResponsable,
    listarMovimientoPorId,
    actualizarMovimiento,
    eliminarMovimiento
} from '../controllers/movements_controller.js'

import { listarMovimientosPorFecha } from "../controllers/visualizaciones_controller.js";

const router = Router()

router.post('/registrarMovimiento', autenticar, verificarRol('Administrador', 'Bodeguero'), registrarMovimiento) // aun no se ocupa movil

router.get('/movimientosBodeguero', autenticar, verificarRol('Bodeguero'), listarMovimientosPorResponsable) // aun no se ocupa movil

router.get('/listarMovimiento/:id', autenticar, verificarRol('Administrador', 'Bodeguero'),listarMovimientoPorId) // aun no se  ocupa movil ni front

router.get('/movimientos', autenticar, verificarRol('Administrador'), listarMovimientosPorFecha) 

router.put('/actualizarMovimiento/:id', autenticar, verificarRol('Administrador', 'Bodeguero'), actualizarMovimiento) // aun no se ocupa movil

router.delete('/eliminarMovimiento/:id', autenticar, verificarRol('Administrador'),eliminarMovimiento) // aun no se ocupa movil


export default router