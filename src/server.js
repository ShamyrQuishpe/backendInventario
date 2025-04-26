// Requerir los modulos 
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routerUsers from './routers/user_routes.js'

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

app.use('/gt',routerUsers)

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

// Exportar la instancia de express por medio de app
export default app