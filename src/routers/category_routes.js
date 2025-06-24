import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

import{
    crearCategoria,
    listarCategorias,
    actualizarCategorias,
    eliminarCategoria,

} from '../controllers/category_controller.js'

const router = Router()

router.post('/crearCategoria', autenticar, verificarRol('Administrador'), crearCategoria) //Monica

router.get('/listarCategorias', autenticar, verificarRol('Administrador', 'Vendedor', 'Bodeguero'), listarCategorias) //Monica Miguel

router.put('/actualizarCategoria/:id', autenticar, verificarRol('Administrador'), actualizarCategorias) //Monica

router.delete('/eliminarCategoria/:id', autenticar, verificarRol('Administrador'), eliminarCategoria) //Monica

export default router