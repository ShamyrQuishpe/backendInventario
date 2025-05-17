import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";
import { 
    agregarProducto, 
    listarProductos, 
    listarProductoPorCodigoBarras, 
    actualizarProducto, 
    eliminarProducto 
} from "../controllers/product_controller.js";

import { listarProductosPorFecha } from "../controllers/visualizaciones_controller.js";

const router = Router()


router.post('/agregarProducto', autenticar, verificarRol('Administrador'),agregarProducto)

router.get('/listarProductos', listarProductos) //Si ocupa admin

router.get('/listarProducto/:codigoBarras', listarProductoPorCodigoBarras)

router.get('/productos', listarProductosPorFecha)

router.get('/productosBodeguero', listarProductosPorFecha) //Llebar el id y me va a mostrar por id

router.put('/actualizarProducto/:codigoBarras', actualizarProducto)

router.delete('/eliminarProducto/:codigoBarras', eliminarProducto)


export default router