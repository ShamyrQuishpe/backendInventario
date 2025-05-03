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


export { registrarVenta };
