import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

import {
    agregarAccesorio,
    listarAccesorios,
    detalleAccesorio,
    actualizarAccesorio,
    eliminarAccesorio

} from "../controllers/accesory_controller.js"

const router = Router()

router.post('/agregarAccesorio', autenticar, verificarRol('Administrador'), agregarAccesorio)

router.get('/listarAccesorios', listarAccesorios)

router.get('/listarAccesorio/:codigoBarras', detalleAccesorio)

router.put('/actualizarAccesorio/:codigoBarras', actualizarAccesorio)

router.delete('/eliminarAccesorio/:codigoBarras', eliminarAccesorio)

export default router