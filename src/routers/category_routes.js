import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

import{
    crearCategoria,
    listarCategorias,
    obtenerCategoriasPorId,
    actualizarCategorias,
    eliminarCategoria,

} from '../controllers/category_controller.js'

const router = Router()

router.post('/crearCategoria', autenticar, verificarRol('Administrador'), crearCategoria) 

router.get('/listarCategorias', autenticar, verificarRol('Administrador', 'Vendedor', 'Bodeguero'), listarCategorias)

router.get('/listarCategoria/:id', autenticar, verificarRol('Administrador'), obtenerCategoriasPorId)

router.put('/actualizarCategoria/:id', autenticar, verificarRol('Administrador'), actualizarCategorias)

router.delete('/eliminarCategoria/:id', autenticar, verificarRol('Administrador'), eliminarCategoria)

export default router