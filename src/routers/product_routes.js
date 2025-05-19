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


router.post('/agregarProducto', autenticar, verificarRol('Administrador', 'Bodeguero'), agregarProducto)

router.get('/listarProductos', autenticar, verificarRol('Administrador', 'Bodeguero'), listarProductos) 

router.get('/listarProducto/:codigoBarras', autenticar, verificarRol('Administrador', 'Bodeguero'), listarProductoPorCodigoBarras) //aun no se usa front ni movil

router.get('/productosBodeguero', autenticar, verificarRol('Bodeguero'), listarProductosPorResponsable) // aun no ocupa movil

router.get('/productos', autenticar, verificarRol('Administrador'), listarProductosPorFecha)

router.put('/actualizarProducto/:codigoBarras', autenticar, verificarRol('Administrador', 'Bodeguero'), actualizarProducto) // movil aun no ocupa

router.delete('/eliminarProducto/:codigoBarras', autenticar, verificarRol('Administrador'), eliminarProducto) // movil aun no ocupa


export default router