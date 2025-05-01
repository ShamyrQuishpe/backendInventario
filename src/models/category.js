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

const Categories = mongoose.model('Categories', categorySchema); // Nombre del modelo 'Categories'

export default Categories;