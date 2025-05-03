import mongoose, {Schema, model} from 'mongoose'

const productSchema = new Schema({
    codigoBarras:{
        type: String,
        require: true,
    },
    codigoUnico:{
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
        type: String,
        require: true
    },
    responsable:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    tipo:{
        type: String,
        require: true
    },
    estado:{
        type: String,
        require: true
    },
    categoriaNombre:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
    },
})

export default mongoose.model('Products',productSchema) 