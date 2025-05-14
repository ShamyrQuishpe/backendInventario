// Requerir los modulos 
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routerUsers from './routers/user_routes.js'
import routerProducts from './routers/product_routes.js'
import routerCategory from './routers/category_routes.js'
import routerAccesory from './routers/accesory_router.js'
import routerVents from './routers/vents_routes.js'
import routerMovements from './routers/move_routes.js'
import routerStock from './routers/stock_router.js'
// Inicializacion 
const app = express ()
dotenv.config()

// Configuraciones 
app.set('port', process.env.port || 3000)
app.use(cors())

// Middlewares
app.use(express.json())

// Rutas
app.get('/',(req,res)=>{
    res.send("Server on")
})

app.use('/gt',routerUsers)  //poner subramas
app.use('/gt',routerProducts)
app.use('/gt',routerCategory)
app.use('/gt',routerAccesory)
app.use('/gt',routerVents)
app.use('/gt',routerMovements)
app.use('/gt',routerStock)

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

// Exportar la instancia de express por medio de app
export default app