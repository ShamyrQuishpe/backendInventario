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
        type: String,
        require: true
    }
})

export default mongoose.model('Accesories', accesorySchema)