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

router.post('/agregarAccesorio', autenticar, verificarRol('Administrador', 'Bodeguero'), agregarAccesorio) 

router.get('/listarAccesorios', autenticar, verificarRol('Administrador', 'Bodeguero'), listarAccesorios)

router.get('/listarAccesorio/:codigoBarras', autenticar, verificarRol('Administrador', 'Bodeguero', 'Vendedor'), detalleAccesorio) // aun no se ocupa front ni movil

router.get('/accesoriosBodeguero', autenticar, verificarRol('Administrador', 'Bodeguero'), listarAccesoriosPorResponsable) // aun no se ocupa movil

router.get('/accesorios',autenticar, verificarRol('Administrador'), listarAccesoriosPorFecha)

router.put('/actualizarAccesorio/:codigoBarras', autenticar, verificarRol('Administrador', 'Bodeguero'), actualizarAccesorio) // aun no se ocupa movil

router.delete('/eliminarAccesorio/:codigoBarras', autenticar, verificarRol('Administrador'), eliminarAccesorio) // aun no se ocupa movil

export default router