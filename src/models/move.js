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
    /*responsable:{
        type: mongoose.Schema.Types.ObjectId, //nombre
        ref: 'user'
    },*/
    areaLlegada:{
        type: String,
        require: true,
    },
    areaSalida:{
        type: String,
        require: true,
    },
    observacion:{
        type: String,
        require: true
    }
})

export default model('Movements', moveSchema)