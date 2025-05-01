import mongoose, { Schema, model } from "mongoose";

const categorySchema = new Schema({
    nombreCategoria:{
        type: String,
        require: true,
    },
    descripcionCategoria:{
        type: String,
        require: true
    }
})

export default model('Categories',categorySchema)