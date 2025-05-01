import Categories from '../models/category.js';
import Products from '../models/product.js'

const generarCodigoBarras = () => {
    let codigo = "";

    for (let i = 0; i < 12; i++) {
        codigo += Math.floor(Math.random() * 10)
    }

    let suma = 0;
    for (let i = 0; i < 12; i++) {
        let num = parseInt(codigo[i]);
        suma += (i % 2 ===0) ? num:num * 3;
    }
    let digitoControl = (10 - (suma % 10)) % 10

    return codigo + digitoControl
}

const generarCodigoBarrasUnico = async (req,res) => {
    let codigoBarras;
    let existe = true;

    while (existe) {
        codigoBarras = generarCodigoBarras();
        const productoExistente = await Products.findOne({ codigoBarras })
        if (!productoExistente) {
            existe = false;
        }
    }

    return codigoBarras;
}

const agregarProducto = async (req, res) => {
    const { codigoBarras, categoriaNombre, ...otrosCampos } = req.body;

    if (Object.values(otrosCampos).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }
    console.log(req.body)
    try {
        const categoria = await Categories.findOne({ nombreCategoria: categoriaNombre });
        console.log(categoria)
        if (!categoria) {
            return res.status(400).json({ msg: "Categoría no encontrada" });
        }

        const codigoBarrasGenerado = await generarCodigoBarrasUnico();

        const nuevoProducto = new Products({
            ...otrosCampos,
            codigoBarras: codigoBarrasGenerado,
            responsable: req.user_id,
            categoriaNombre: categoria._id,  
        });

        await nuevoProducto.save();

        res.status(200).json({
            msg: "Producto agregado correctamente",
            producto: nuevoProducto,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al agregar el producto" });
    }
};


export {
    agregarProducto
}