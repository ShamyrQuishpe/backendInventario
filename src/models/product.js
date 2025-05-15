import mongoose, {Schema, model} from 'mongoose'

const productSchema = new Schema({
    codigoBarras:{
        type: String, 
        require: true,
    },
    codigoModelo:{
        type: String,
        require: true,
    },
    codigoSerial:{
        type: String,
        require: true,
    },
    nombreEquipo:{
        type: String,
        require: true,
    },
    color:{
        type: String,
        require: true,
    },
    capacidad:{
        type: String,
        require: true,
    },
    precio:{
        type: Number,
        require: true
    },
    responsable: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            nombre: { type: String },
        }
    ],
    tipo:{
        type: String,
        require: true
    },
    estado:{
        type: String,
        require: true
    },
    categoriaNombre: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'category'},
            nombreCategoria: { type:String },
        }
    ],
    locacion:{
        type: String,
        require: true
    },
    fechaIngreso:{
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Products',productSchema) 