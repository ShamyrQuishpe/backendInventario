import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";
import { agregarProducto } from "../controllers/product_controller.js";

const router = Router()


router.post('/agregarProducto', autenticar, verificarRol('Administrador'),agregarProducto)

//router.get('/listarProductos',)

//router.get('/listarProducto/:codigoBarras',)

//router.put('/actualzarProducto')

//router.delete('/eliminarProducto')

//Faltan endpoints para los pr

export default router