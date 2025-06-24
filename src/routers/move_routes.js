import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

import {
    registrarMovimiento,
    listarMovimientosPorResponsable,
    actualizarMovimiento,
    eliminarMovimiento
} from '../controllers/movements_controller.js'

import { listarMovimientosPorFecha } from "../controllers/visualizaciones_controller.js";

const router = Router()

router.post('/registrarMovimiento', autenticar, verificarRol('Administrador', 'Bodeguero'), registrarMovimiento) //Miguel

router.get('/movimientosBodeguero', autenticar, verificarRol('Bodeguero'), listarMovimientosPorResponsable) //Miguel

router.get('/movimientos', autenticar, verificarRol('Administrador'), listarMovimientosPorFecha) //Monica

router.put('/actualizarMovimiento/:id', autenticar, verificarRol('Administrador', 'Bodeguero'), actualizarMovimiento) //Monica Miguel

router.delete('/eliminarMovimiento/:id', autenticar, verificarRol('Administrador'),eliminarMovimiento) //Monica


export default router