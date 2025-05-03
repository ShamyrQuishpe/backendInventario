import { Router } from "express";
import { registrarVenta } from "../controllers/vent_controller.js";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

const router = Router()


router.post('/registrarVenta', autenticar, verificarRol('Administrador'), registrarVenta)

/*router.get('/listarVentas', listarProductos)

router.get('/detalleVenta/:id', listarProductoPorCodigoBarras)

router.put('/actualizarVenta/:id', actualizarProducto)

router.delete('/eliminarVenta/:id', eliminarProducto)*/

export default router