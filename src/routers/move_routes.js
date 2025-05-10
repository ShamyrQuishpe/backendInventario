import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

import {
    registrarMovimiento,
    listarMovimientos,
    listarMovimientoPorId,
    actualizarMovimiento,
    eliminarMovimiento
} from '../controllers/movements_controller.js'

const router = Router()

router.post('/registrarMovimiento', autenticar, verificarRol('Administrador'), registrarMovimiento)

/router.get('/listarMovimientos', listarMovimientos)

router.get('/listarMovimiento/:id', listarMovimientoPorId)

router.put('/actualizarMovimiento/:id', actualizarMovimiento)

router.delete('/eliminarMovimiento/:id', eliminarMovimiento)

export default router