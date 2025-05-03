import { Router } from "express";

import {
    agregarAccesorio,
    listarAccesorios,
    detalleAccesorio,
    actualizarAccesorio,
    eliminarAccesorio

} from "../controllers/accesory_controller.js"

const router = Router()

router.post('/agregarAccesorio', agregarAccesorio)

router.get('/listarAccesorios', listarAccesorios)

router.get('/listarAccesorio/:codigoBarras', detalleAccesorio)

router.put('/actualizarAccesorio/:codigoBarras', actualizarAccesorio)

router.delete('/eliminarAccesorio/:codigoBarras', eliminarAccesorio)

export default router