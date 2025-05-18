import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

import { listarStockDisponible } from "../controllers/visualizaciones_controller.js";

const router = Router()

router.get('/stockDisponible', autenticar, verificarRol('Administrador', 'Vendedor'), listarStockDisponible) //aun no se ocupa

export default router