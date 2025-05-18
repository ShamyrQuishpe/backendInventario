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

router.post('/registrarMovimiento', autenticar, verificarRol('Administrador'), registrarMovimiento)

router.get('/movimientosBodeguero', listarMovimientosPorResponsable)

router.get('/listarMovimiento/:id', listarMovimientoPorId)

router.get('/movimientos', listarMovimientosPorFecha)

router.put('/actualizarMovimiento/:id', actualizarMovimiento)

router.delete('/eliminarMovimiento/:id', eliminarMovimiento)


export default router