import mongoose, {Schema, model} from "mongoose";

const accesorySchema = new Schema({
    codigoBarrasAccs:{
        type: String,
        required: true
    },
    codigoModeloAccs:{
        type: String,
        required: true
    },
    nombreAccs:{
        type: String,
        required: true
    },
    precioAccs:{
        type: Number,
        required: true
    },
    disponibilidadAccs:{
        type: String,
        required: true
    },
    locacionAccs:{
        type: String,
        required: true
    },
    responsableAccs:[
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            nombre: { type: String },
        }
    ],
    fechaIngreso:{
        type: Date,
        default: Date.now
    },
    categoriaNombre: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'category'},
            nombreCategoria: { type:String },
        }
    ],
})

export default mongoose.model('Accesories', accesorySchema)