import Accesories from '../models/accesory.js'
import Products from '../models/product.js'

const generarCodigoBarras = () => {
    let codigo = "";
    for (let i = 0; i < 12; i++) {
        codigo += Math.floor(Math.random() * 10);
    }

    let suma = 0;
    for (let i = 0; i < 12; i++) {
        let num = parseInt(codigo[i]);
        suma += (i % 2 === 0) ? num : num * 3;
    }

    let digitoControl = (10 - (suma % 10)) % 10;
    return codigo + digitoControl;
};


const generarCodigoBarrasAccesorio = async () => {
    let codigoBarras;
    let existe = true;

    while (existe) {
        codigoBarras = generarCodigoBarras();
        const existeEnProductos = await Products.findOne({ codigoBarras });
        const existeEnAccesorios = await Accesories.findOne({ codigoBarrasAccs: codigoBarras });

        if (!existeEnProductos && !existeEnAccesorios) {
            existe = false;
        }
    }

    return codigoBarras;
};

const agregarAccesorio = async (req, res) => {
    const { codigoUnicoAccs, nombreAccs, precioAccs } = req.body;


    try {
        const codigoBarrasGenerado = await generarCodigoBarrasAccesorio();

        const nuevoAccesorio = new Accesories({
            codigoBarrasAccs: codigoBarrasGenerado,
            codigoUnicoAccs: codigoUnicoAccs.trim(),
            nombreAccs: nombreAccs.trim(),
            precioAccs: precioAccs,
            disponibilidadAccs: "Disponible",
            locacionAccs: req.user.area,
        });

        await nuevoAccesorio.save();

        res.status(200).json({
            msg: "Accesorio agregado correctamente",
            accesorio: nuevoAccesorio
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al agregar el accesorio" });
    }
};

const listarAccesorios = async (req, res) => {
    try {
        const accesorios = await Accesories.find();
        res.status(200).json(accesorios);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los accesorios", error });
    }
};

const detalleAccesorio = async (req, res) => {
    const { codigoBarras } = req.params;

    try {
        const accesorio = await Accesories.findOne({ codigoBarrasAccs: codigoBarras });

        if (!accesorio) {
            return res.status(404).json({ msg: "Accesorio no encontrado" });
        }

        res.status(200).json(accesorio);
    } catch (error) {
        res.status(500).json({ msg: "Error al buscar el accesorio", error });
    }
};

const actualizarAccesorio = async (req, res) => {
    const { codigoBarras } = req.params;
    const { codigoUnicoAccs, nombreAccs, precioAccs, disponibilidadAccs } = req.body;

    try {
        const accesorio = await Accesories.findOne({ codigoBarrasAccs: codigoBarras });

        if (!accesorio) {
            return res.status(404).json({ msg: "Accesorio no encontrado" });
        }

        accesorio.codigoUnicoAccs = codigoUnicoAccs || accesorio.codigoUnicoAccs;
        accesorio.nombreAccs = nombreAccs || accesorio.nombreAccs;
        accesorio.precioAccs = precioAccs || accesorio.precioAccs;
        accesorio.disponibilidadAccs = disponibilidadAccs || accesorio.disponibilidadAccs;


        await accesorio.save();

        res.status(200).json({ msg: "Accesorio actualizado correctamente", accesorio });
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar el accesorio", error });
    }
};


const eliminarAccesorio = async (req, res) => {
    const { codigoBarras } = req.params;

    try {
        const accesorioEliminado = await Accesories.findOneAndDelete({ codigoBarrasAccs: codigoBarras });

        if (!accesorioEliminado) {
            return res.status(404).json({ msg: "Accesorio no encontrado" });
        }

        res.status(200).json({ msg: "Accesorio eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar el accesorio", error });
    }
};

export {
    agregarAccesorio,
    listarAccesorios,
    detalleAccesorio,
    actualizarAccesorio,
    eliminarAccesorio
}