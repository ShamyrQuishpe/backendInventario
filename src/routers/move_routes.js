import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

import {
    registrarMovimiento
} from '../controllers/movements_controller.js'

const router = Router()

router.post('/registrarMovimiento', autenticar, verificarRol('Administrador'), registrarMovimiento)

/*router.get('/listarMovimientos', listarAccesorios)

router.get('/listarMovimiento/:id', detalleAccesorio)

router.put('/actualizarMovimiento/:id', actualizarAccesorio)

router.delete('/eliminarMovimiento/:id', eliminarAccesorio)*/

export default router