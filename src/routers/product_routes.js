import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";
import { 
    agregarProducto, 
    listarProductos, 
    listarProductoPorCodigoBarras,
    listarProductosPorResponsable,
    actualizarProducto, 
    eliminarProducto 
} from "../controllers/product_controller.js";

import { listarProductosPorFecha } from "../controllers/visualizaciones_controller.js";

const router = Router()


router.post('/agregarProducto', autenticar, verificarRol('Administrador'),agregarProducto)

router.get('/listarProductos', listarProductos) 

router.get('/listarProducto/:codigoBarras', listarProductoPorCodigoBarras)

router.get('/productosBodeguero', autenticar, verificarRol('Administrador'), listarProductosPorResponsable)

router.get('/productos', listarProductosPorFecha)

router.put('/actualizarProducto/:codigoBarras', actualizarProducto)

router.delete('/eliminarProducto/:codigoBarras', eliminarProducto)


export default router