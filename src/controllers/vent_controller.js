import Vents from '../models/vent.js'
import Products from '../models/product.js'

const registrarVenta = async (req, res) => {
    let productosModificados = [];
    try {
        const { cliente, metodoPago, descripcion, productos } = req.body;

        if (!cliente || !cliente.cedula || !cliente.nombre) {
            return res.status(400).json({ msg: "Información del cliente incompleta" });
        }

        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ msg: "Debes seleccionar al menos un producto" });
        }

        const productosFinales = [];
        const productosParaActualizar = [];
        let total = 0;

        // 1. Validar productos
        for (const item of productos) {
            const producto = await Products.findOne({ codigoBarras: item.codigoBarras });

            if (!producto) {
                return res.status(404).json({ msg: `Producto con código ${item.codigoBarras} no encontrado` });
            }

            if (producto.estado !== "Disponible") {
                return res.status(400).json({ msg: `Producto con código ${item.codigoBarras} ya fue vendido` });
            }

            productosFinales.push({
                producto: producto._id,
                codigoBarras: producto.codigoBarras,
                nombreEquipo: producto.nombreEquipo, //agregar serial y codigo barras accesorios
                precioUnitario: Number(producto.precio)
            });

            productosParaActualizar.push(producto);
            total += Number(producto.precio);
        }

        // 2. Cambiar estado de productos a "No disponible"
        for (const p of productosParaActualizar) {
            p.estado = "No disponible";
            await p.save();
            productosModificados.push(p)
        }

        // 3. Guardar la venta
        const nuevaVenta = new Vents({
            cliente: {
                cedula: cliente.cedula,
                nombre: cliente.nombre
            },
            metodoPago,
            descripcion,
            vendedor: req.user._id,
            productos: productosFinales,
            total
        });

        await nuevaVenta.save();

        res.status(200).json({
            msg: "Venta registrada exitosamente",
            venta: nuevaVenta
        });

    } catch (error) {
        
        console.log(productosModificados)
        for (const producto of productosModificados) {
            try {
              console.log(`Revirtiendo producto ${producto._id}`);
              await Products.findByIdAndUpdate(producto._id, { estado: "Disponible" });
            } catch (e) {
              console.error(`Error al revertir producto ${producto._id}:`, e.message);
            }
        }
        console.error("Error al registrar la venta:", error);

        res.status(500).json({ msg: "Ocurrió un error al registrar la venta, los productos fueron revertidos" });
    }
};

const listarVentas = async (req, res) => {
    try {
        const ventas = await Vents.find()

        if(ventas.length === 0){
            return res.status(400).json({ msg: "No se encontraron ventas"})
        }

        res.status(200).json(ventas);
    } catch (error) {
        console.error("Error al listar ventas:", error);
        res.status(500).json({ msg: "Error al listar las ventas" });
    }
};

const detalleVenta = async (req, res) => {
    try {
        const venta = await Vents.findById(req.params.id)

        if (!venta) {
            return res.status(404).json({ msg: "Venta no encontrada" });
        }

        res.status(200).json(venta);
    } catch (error) {
        console.error("Error al obtener el detalle de la venta:", error);
        res.status(500).json({ msg: "Error al obtener el detalle de la venta" });
    }
};

const actualizarVenta = async (req, res) => {
    try {
        const { observacion, metodoPago } = req.body;

        const ventaActualizada = await Vents.findByIdAndUpdate(
            req.params.id,
            { observacion, metodoPago },
            { new: true }
        );

        if (!ventaActualizada) {
            return res.status(404).json({ msg: "Venta no encontrada" });
        }

        res.status(200).json({ msg: "Venta actualizada correctamente", venta: ventaActualizada });
    } catch (error) {
        console.error("Error al actualizar la venta:", error);
        res.status(500).json({ msg: "Error al actualizar la venta" });
    }
};

/*const eliminarVenta = async (req, res) => { //revisar si es conveniente o no devolver la disponibilidad del producto
    try {
        const venta = await Vents.findById(req.params.id);

        if (!venta) {
            return res.status(404).json({ msg: "Venta no encontrada" });
        }

        for (const item of venta.productos) {
            await Products.findByIdAndUpdate(item.producto, { estado: "Disponible" });
        }

        await venta.deleteOne();

        res.status(200).json({ msg: "Venta eliminada correctamente y productos revertidos" });
    } catch (error) {
        console.error("Error al eliminar la venta:", error);
        res.status(500).json({ msg: "Error al eliminar la venta" });
    }
};*/


export { 
    registrarVenta,
    listarVentas,
    detalleVenta,
    actualizarVenta,
    //eliminarVenta
};
