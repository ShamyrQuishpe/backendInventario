import mongoose, {Schema, model} from 'mongoose'

const productSchema = new Schema({
    codigoBarras:{
        type: String, 
        required: true,
    },
    codigoModelo:{
        type: String,
        required: true,
    },
    codigoSerial:{
        type: String,
        required: true,
        unique: true,
    },
    nombreEquipo:{
        type: String,
        required: true,
    },
    color:{
        type: String,
        required: true,
    },
    capacidad:{
        type: String,
        required: true,
    },
    precio:{
        type: Number,
        required: true
    },
    responsable: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            nombre: { type: String },
        }
    ],
    tipo:{
        type: String,
        required: true
    },
    estado:{
        type: String,
        required: true
    },
    categoriaNombre: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'category'},
            nombreCategoria: { type:String },
        }
    ],
    locacion:{
        type: String,
        required: true
    },
    fechaIngreso:{
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Products',productSchema) 