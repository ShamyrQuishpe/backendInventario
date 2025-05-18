import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

import { 
    registrarVenta,
    listarVentasPorVendedor,
    detalleVenta,
    actualizarVenta,
    eliminarVenta
} from "../controllers/vent_controller.js";

import { listarVentasPorFecha } from "../controllers/visualizaciones_controller.js";

const router = Router()

router.post('/registrarVenta', autenticar, verificarRol('Administrador', 'Vendedor'), registrarVenta)

router.get('/listarVentasVendedor', autenticar, verificarRol('Vendedor'), listarVentasPorVendedor) 

router.get('/detalleVenta/:id',autenticar, verificarRol('Administrador', 'Vendedor'), detalleVenta) //aun no se ocupa

router.get('/ventas', autenticar, verificarRol('Administrador'), listarVentasPorFecha)

router.put('/actualizarVenta/:id', autenticar, verificarRol('Vendedor'), actualizarVenta) //aun no se ocupa

router.delete('/eliminarVenta/:id', autenticar, verificarRol('Administrador'), eliminarVenta ) //aun no se ocupa

export default router