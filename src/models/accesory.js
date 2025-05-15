import mongoose, {Schema, model} from "mongoose";

const accesorySchema = new Schema({
    codigoBarrasAccs:{
        type: String,
        require: true
    },
    codigoModeloAccs:{
        type: String,
        require: true
    },
    nombreAccs:{
        type: String,
        require: true
    },
    precioAccs:{
        type: Number,
        require: true
    },
    disponibilidadAccs:{
        type: String,
        require: true
    },
    locacionAccs:{
        type: String,
        require: true
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
    }
})

export default mongoose.model('Accesories', accesorySchema)