import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

import { 
    registrarVenta,
    listarVentasPorVendedor,
    actualizarVenta,
    eliminarVenta
} from "../controllers/vent_controller.js";

import { listarVentasPorFecha } from "../controllers/visualizaciones_controller.js";

const router = Router()

router.post('/registrarVenta', autenticar, verificarRol('Administrador', 'Vendedor'), registrarVenta) //Monica

router.get('/listarVentasVendedor', autenticar, verificarRol('Vendedor'), listarVentasPorVendedor) //Monica

router.get('/ventas', autenticar, verificarRol('Administrador'), listarVentasPorFecha) //Monica

router.put('/actualizarVenta/:id', autenticar, verificarRol('Vendedor'), actualizarVenta) //Monica

router.delete('/eliminarVenta/:id', autenticar, verificarRol('Administrador'), eliminarVenta ) //Monica

export default router