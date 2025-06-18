import Vents from '../models/vent.js'
import Products from '../models/product.js'
import Accesories from '../models/accesory.js'

const registrarVenta = async (req, res) => {
    let productosModificados = [];
    try {
        const { cliente, metodoPago, observacion, productos, accesorios, descuento = 0, numeroDocumento, descripcionDocumento } = req.body;

        if (!cliente || !cliente.cedula || !cliente.nombre) {
            return res.status(400).json({ msg: "Información del cliente incompleta" });
        }

        if (
            (!productos || !Array.isArray(productos) || productos.length === 0) &&
            (!accesorios || !Array.isArray(accesorios) || accesorios.length === 0)
        ) {
            return res.status(400).json({ msg: "Debes agregar al menos un producto o un accesorio" });
        }

        if (metodoPago.toLowerCase() === "transferencia") {
            if (!numeroDocumento || !descripcionDocumento) {
                return res.status(400).json({ msg: "Debes ingresar número y descripción del documento para pagos por transferencia" });
            }
        }

        const productosFinales = [];
        const productosParaActualizar = [];
        const accesoriosFinales = [];
        const accesoriosParaActualizar = [];
        let total = 0;

        // 1. Validar productos
        if(Array.isArray(productos) && productos.length > 0){
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
                    nombreEquipo: producto.nombreEquipo,
                    capacidad: producto.capacidad,
                    color: producto.color,
                    codigoSerial: producto.codigoSerial,
                    precioUnitario: Number(producto.precio)
                });

                productosParaActualizar.push(producto);
                total += Number(producto.precio);
            }
        }    
        //Procesar accesorios (si existen)
        
        if(Array.isArray(accesorios) && accesorios.length > 0){
            for(const item of accesorios){
                const accs = await Accesories.findOne({ codigoBarrasAccs: item.codigoBarrasAccs})
                if (!accs) {
                    return res.status(404).json({ msg: `Producto con código ${item.codigoBarras} no encontrado` });
                }

                if (accs.disponibilidadAccs !== "Disponible") {
                    return res.status(400).json({ msg: `Producto con código ${item.codigoBarras} ya fue vendido` });
                }

                accesoriosFinales.push({
                    accesorio: accs._id,
                    codigoBarrasAccs: accs.codigoBarrasAccs,
                    nombreAccs: accs.nombreAccs,
                    precioUnitario: Number(accs.precioAccs)

                })

                accesoriosParaActualizar.push(accs);
                total += Number(accs.precioAccs)
            }

        }

        if (descuento > total){
            return res.status(400).json({ msg: "El descuento no puede ser mayor a el total de la venta"})
        }
        let totalFinal = total - descuento;
        // 2. Cambiar estado de productos a "No disponible"
        for (const p of productosParaActualizar) {
            p.estado = "No disponible";
            await p.save();
            productosModificados.push(p)
        }

        // 2. Cambiar estado de productos a "No disponible"
        for (const a of accesoriosParaActualizar){
            a.disponibilidadAccs = "No disponible";
            await a.save();
            productosModificados.push(a)
        }

        // 3. Guardar la venta
        const nuevaVenta = new Vents({
            cliente: {
                cedula: cliente.cedula,
                nombre: cliente.nombre
            },
            metodoPago,
            observacion,
            //vendedor: req.user._id,
            vendedor: {
                id: req.user._id,
                nombreVendedor: req.user.nombre,
            },
            productos: productosFinales,
            accesorios: accesoriosFinales,
            total: totalFinal,
            descuento,
            numeroDocumento,
            descripcionDocumento
        });

        await nuevaVenta.save();

        res.status(200).json({
            msg: "Venta registrada exitosamente",
            venta: nuevaVenta
        });

    } catch (error) {
        
        console.log(productosModificados)

            for (const item of productosModificados) {
                try {
                    if (item.estado !== undefined) {
                        await Products.findByIdAndUpdate(item._id, { estado: "Disponible" });
                    } else if (item.disponibilidadAccs !== undefined) {
                        await Accesories.findByIdAndUpdate(item._id, { disponibilidadAccs: "Disponible" });
                    }
                } catch (e) {
                    console.error(`Error al revertir item ${item._id}:`, e.message);
                }
            }
        console.error("Error al registrar la venta:", error);

        res.status(500).json({ msg: "Ocurrió un error al registrar la venta, los productos fueron revertidos" });
    }
};
const listarVentasPorVendedor = async (req, res) => {
    try {
        if (!req.usuario || !req.usuario._id) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
        }
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

        const ventas = await Vents.find({
            fecha: {
                $gte: fechaInicio,
                $lte: fechaFin
            },
            'vendedor.id': userID,
        });

        res.status(200).json(ventas);
    } catch (error) {
        console.error('Error al listar ventas por vendedor:', error);
        res.status(500).json({ message: 'Error del servidor' });
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
        const { observacion, metodoPago } = req.body; //actualizar cliente y descuento

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

const eliminarVenta = async (req, res) => { //revisar si es conveniente o no devolver la disponibilidad del producto
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
};


export { 
    registrarVenta,
    listarVentasPorVendedor,
    detalleVenta,
    actualizarVenta,
    eliminarVenta
};
