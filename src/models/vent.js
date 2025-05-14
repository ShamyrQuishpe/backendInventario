import mongoose, { model, Schema } from "mongoose";

const ventSchema = new Schema({
    cliente: {
        cedula: { type: String, required: true },
        nombre: { type: String, required: true }
    },
    metodoPago: {
        type: String,
        required: true
    },
    vendedor:[
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            nombreVendedor: { type :String }
        }
    ],
    productos: [
        {
          producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
          codigoBarras: { type: String },
          nombreEquipo: { type: String },
          capacidad: { type: String },
          color: { type: String },
          codigoSerial : { type: String },
          precioUnitario: { type: Number, required: true }
        }
    ],
    accesorios: [
        {
            accesorio: { type: mongoose.Schema.Types.ObjectId, ref: 'Accesories' },
            codigoBarrasAccs: { type: String },
            nombreAccs: { type: String },
            precioUnitario: { type: Number, required: true }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    descuento: {
        type: Number,
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    numeroDocumento:{
        type: String
    },
    descripcionDocumento: {
        type: String
    },
    observacion: {
        type: String
    }
});

export default model('Vents', ventSchema)