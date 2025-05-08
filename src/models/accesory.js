import mongoose, {Schema, model} from "mongoose";

const accesorySchema = new Schema({
    codigoBarrasAccs:{
        type: String,
        require: true
    },
    codigoUnicoAccs:{
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
    responsableAccs:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
})

export default mongoose.model('Accesories', accesorySchema)