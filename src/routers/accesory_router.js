import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

import {
    agregarAccesorio,
    listarAccesorios,
    listarAccesoriosPorResponsable,
    detalleAccesorio,
    actualizarAccesorio,
    eliminarAccesorio

} from "../controllers/accesory_controller.js"

import { listarAccesoriosPorFecha } from "../controllers/visualizaciones_controller.js";

const router = Router()

router.post('/agregarAccesorio', autenticar, verificarRol('Administrador', 'Bodeguero'), agregarAccesorio) //Monica Miguel

router.get('/listarAccesorios', autenticar, verificarRol('Administrador', 'Bodeguero'), listarAccesorios) //Monica Miguel

router.get('/listarAccesorio/:codigoBarras', autenticar, verificarRol('Administrador', 'Bodeguero', 'Vendedor'), detalleAccesorio) //Miguel

router.get('/accesoriosBodeguero', autenticar, verificarRol('Administrador', 'Bodeguero'), listarAccesoriosPorResponsable) //Miguel

router.get('/accesorios',autenticar, verificarRol('Administrador'), listarAccesoriosPorFecha) //Monica

router.put('/actualizarAccesorio/:codigoBarras', autenticar, verificarRol('Administrador', 'Bodeguero'), actualizarAccesorio) //Monica Miguel

router.delete('/eliminarAccesorio/:codigoBarras', autenticar, verificarRol('Administrador'), eliminarAccesorio) //Monica Miguel

export default router