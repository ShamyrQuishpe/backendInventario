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


router.post('/agregarProducto', autenticar, verificarRol('Administrador', 'Bodeguero'), agregarProducto) //Monica Miguel

router.get('/listarProductos', autenticar, verificarRol('Administrador', 'Bodeguero'), listarProductos) //Monica Miguel

router.get('/listarProducto/:codigoBarras', autenticar, verificarRol('Administrador', 'Bodeguero', 'Vendedor'), listarProductoPorCodigoBarras) //Miguel

router.get('/productosBodeguero', autenticar, verificarRol('Bodeguero'), listarProductosPorResponsable) //Miguel

router.get('/productos', autenticar, verificarRol('Administrador'), listarProductosPorFecha) //Monica

router.put('/actualizarProducto/:codigoBarras', autenticar, verificarRol('Administrador', 'Bodeguero'), actualizarProducto) //Monica Miguel

router.delete('/eliminarProducto/:codigoBarras', autenticar, verificarRol('Administrador'), eliminarProducto) //Monica


export default router