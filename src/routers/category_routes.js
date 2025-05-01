import { Router } from "express";

import{
    crearCategoria,
    listarCategorias,
    obtenerCategoriasPorId,
    actualizarCategorias,
    eliminarCategoria,

} from '../controllers/category_controller.js'

const router = Router()

router.post('/crearCategoria', crearCategoria)

router.get('/listarCategorias', listarCategorias)

router.get('/listarCategoria/:id', obtenerCategoriasPorId)

router.put('/actualizarCategoria/:id', actualizarCategorias)

router.delete('/eliminarCategoria/:id', eliminarCategoria)

export default router