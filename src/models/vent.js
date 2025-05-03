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
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    productos: [
        {
          producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
          codigoBarras: { type: String },
          nombreEquipo: { type: String },
          precioUnitario: { type: Number, required: true }
        }
    ],
    total: {
        type: Number,
        required: true
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