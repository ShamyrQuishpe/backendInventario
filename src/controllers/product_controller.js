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
    const { codigoBarras, codigoSerial, categoriaNombre, ...otrosCampos } = req.body;

    if (Object.values(otrosCampos).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }
    console.log(req.body)
    try {

        const productoExistente = await Products.findOne({ codigoSerial });
        if (productoExistente) {
            return res.status(400).json({ msg: "El código de serie ya está registrado para otro producto" });
        }

        const categoria = await Categories.findOne({ nombreCategoria: categoriaNombre });
        console.log(categoria)
        if (!categoria) {
            return res.status(400).json({ msg: "Categoría no encontrada" });
        }

        const codigoBarrasGenerado = await generarCodigoBarrasUnico();

        const nuevoProducto = new Products({
            ...otrosCampos,
            codigoBarras: codigoBarrasGenerado,
            codigoSerial,
            responsable: {
                id: req.user._id,
                nombre: req.user.nombre
            },
            categoriaNombre: {
                id:categoria._id,
                nombreCategoria: categoriaNombre
            },
            estado:"Disponible",
            locacion: req.user.area,
        });

        console.log(req.user._id)

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

const listarProductos = async (req, res) => {
    try {
        // Obtener todos los productos
        const productos = await Products.find();

        if (productos.length === 0) {
            return res.status(404).json({ msg: "No se encontraron productos" });
        }

        // Responder con los productos
        res.status(200).json({ productos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al obtener los productos" });
    }
};

const listarProductosPorResponsable = async (req, res) => {
    try {
        const { desde, hasta } = req.query;

        let fechaInicio, fechaFin;

        if (!desde && !hasta) {
            // Por defecto: hoy (a las 00:00:00)
            const hoy = new Date();
            fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

            // Mañana (inicio del día siguiente)
            fechaFin = new Date(fechaInicio);
            fechaFin.setDate(fechaFin.getDate() + 1);

            console.log(fechaInicio)
            console.log(fechaFin)
        } else {
            // Si viene "desde"
            const desdeDate = desde ? new Date(desde) : new Date();
            fechaInicio = new Date(desdeDate.getFullYear(), desdeDate.getMonth(), desdeDate.getDate());
            fechaInicio.setDate(fechaInicio.getDate() + 1)
            if (hasta) {
                const hastaDate = new Date(hasta);
                fechaFin = new Date(hastaDate.getFullYear(), hastaDate.getMonth(), hastaDate.getDate());
                fechaFin.setDate(fechaFin.getDate() + 2); // +1 día para incluir todo el 'hasta'
            } else {
                fechaFin = new Date(fechaInicio);
                fechaFin.setDate(fechaFin.getDate() + 1);
            }

            console.log(fechaInicio)
            console.log(fechaFin)
        }

        const userID = req.user._id;

        if(!userID){
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        const productos = await Products.find({
            fechaIngreso: {
                $gte: fechaInicio,
                $lte: fechaFin
            },
            'responsable.id': userID,
        });

        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al listar productos por fecha:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const listarProductoPorCodigoBarras = async (req, res) => {
    const { codigoBarras } = req.params;

    try {
        const producto = await Products.findOne({ codigoBarras })

        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        res.status(200).json({ producto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al buscar el producto" });
    }
};

const actualizarProducto = async (req, res) => {
    const { codigoBarras } = req.params;
    const { categoriaNombre, ...otrosCampos } = req.body;

    try {
        // Buscar el producto
        const producto = await Products.findOne({ codigoBarras });

        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        // Si se proporciona un nuevo nombre de categoría, buscarla y actualizar el producto
        if (categoriaNombre) {
            const categoria = await Categories.findOne({ nombreCategoria: categoriaNombre });

            if (!categoria) {
                return res.status(400).json({ msg: "Categoría no encontrada" });
            }

            // Actualizar el producto con el ObjectId de la categoría
            producto.categoriaNombre = categoria._id;
        }

        // Actualizar los otros campos
        Object.assign(producto, otrosCampos);

        await producto.save();

        res.status(200).json({
            msg: "Producto actualizado correctamente",
            producto,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al actualizar el producto" });
    }
};

const eliminarProducto = async (req, res) => {
    const { codigoBarras } = req.params;

    try {
        const producto = await Products.findOneAndDelete({ codigoBarras });

        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        res.status(200).json({ msg: "Producto eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al eliminar el producto" });
    }
};


export {
    agregarProducto,
    listarProductos,
    listarProductoPorCodigoBarras,
    listarProductosPorResponsable,
    actualizarProducto,
    eliminarProducto
}