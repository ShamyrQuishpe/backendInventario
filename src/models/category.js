import mongoose, { Schema, model } from "mongoose";

const categorySchema = new Schema({
    nombreCategoria:{
        type: String,
        required: true,
    },
    descripcionCategoria:{
        type: String,
        required: true
    }
})

const Categories = mongoose.model('Categories', categorySchema); // Nombre del modelo 'Categories'

export default Categories;