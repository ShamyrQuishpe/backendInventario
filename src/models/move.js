import mongoose, { Schema, model } from "mongoose";

const moveSchema = new Schema({
    productos: [
        {
            producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
            codigoBarras: { type: String },
            nombreEquipo: { type: String },
            capacidad: { type: String },
            color: { type: String },
            codigoSerial : { type: String },
        }
    ],
    accesorios: [
        {
            accesorio: { type: mongoose.Schema.Types.ObjectId, ref: 'Accesories' },
            codigoBarrasAccs: { type: String },
            nombreAccs: { type: String },
        }
    ],
    fecha:{
        type: Date,
        default: Date.now,
    },
    responsable: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Accesories' },
            nombreResponsable: { type: String },
        }
    ],
    areaLlegada:{
        type: String,
        required: true,
    },
    areaSalida:{
        type: String,
        required: true,
    },
    observacion:{
        type: String,
    }
})

export default model('Movements', moveSchema)