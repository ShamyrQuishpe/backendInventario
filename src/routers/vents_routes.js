import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

import { 
    registrarVenta,
    listarVentas,
    detalleVenta,
    actualizarVenta,
    //eliminarVenta
} from "../controllers/vent_controller.js";

const router = Router()


router.post('/registrarVenta', autenticar, verificarRol('Administrador'), registrarVenta)

router.get('/listarVentas', listarVentas)

router.get('/detalleVenta/:id', detalleVenta)

router.put('/actualizarVenta/:id', actualizarVenta)

//router.delete('/eliminarVenta/:id', eliminarVenta )

export default router