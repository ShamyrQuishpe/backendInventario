import Movements from '../models/move.js'
import Products from '../models/product.js'
import Accesories from '../models/accesory.js'

const registrarMovimiento = async (req, res) => {
    let locacionModificada = [];
    try{
        const { productos, accesorios, areaLlegada, areaSalida } = req.body
        
        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ msg: "Debes agregar al menos un producto" });
        }

        const productosFinales = [];
        const productosParaActualizar = [];
        const accesoriosFinales = [];
        const accesoriosParaActualizar = [];

        for (const item of productos) {
            const producto = await Products.findOne( {codigoBarras: item.codigoBarras} )
            if(!producto) {
                return res.status(404).json({ msg: `Producto con Codigo ${item.codigoBarras} no encontrado`})
            }

            if(producto.locacion !== req.user.area){
                return res.status(400).json({msg: `El producto con Codigo ${item.codigoBarras} no está en el área de salida (${req.user.area}) actual, sino en ${producto.locacion}`});
            }

            productosFinales.push({
                producto: producto._id,
                codigoBarras: producto.codigoBarras,
                nombreEquipo: producto.nombreEquipo,
                capacidad: producto.capacidad,
                color: producto.color,
                codigoSerial: producto.codigoSerial
            })

            productosParaActualizar.push(producto)

        }

//Procesar accesorios (si existen)
        
        if(Array.isArray(accesorios) && accesorios.length > 0){
            for(const item of accesorios){
                const accs = await Accesories.findOne({ codigoBarrasAccs: item.codigoBarrasAccs})
                if (!accs) {
                    return res.status(404).json({ msg: `Producto con código ${item.codigoBarras} no encontrado` });
                }

                accesoriosFinales.push({
                    accesorio: accs._id,
                    codigoBarrasAccs: accs.codigoBarrasAccs,
                    nombreAccs: accs.nombreAccs,
                })

                accesoriosParaActualizar.push(accs);
            }
        }

        if(!areaLlegada){
            return res.status(400).json({ msg: "Los campos del area de salida y de llegada son obligatorios"})
        }

        // 2. Cambiar estado de productos a "No disponible"
        for (const p of productosParaActualizar) {
            p.locacion = areaLlegada;
            await p.save();
            locacionModificada.push(p)
        }

        // 2. Cambiar estado de productos a "No disponible"
        for (const a of accesoriosParaActualizar){
            a.locacionAccs = areaLlegada;
            await a.save();
            locacionModificada.push(a)
        }

        const movimiento = new Movements({
            productos: productosFinales,
            accesorios: accesoriosFinales,
            areaSalida: req.user.area,
            areaLlegada,
            responsable: req.user._id
        })

        await movimiento.save();
        res.status(201).json({ msg: "Movimiento registrado existosamente", movimiento})
    } catch (error) {
        console.log(locacionModificada)
        
            for (const item of locacionModificada) {
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
        console.error("Error al registrar el movimiento:", error);
        res.status(500).json({ msg: `Error al registrar el movimiento`, error})
    }
}

export {
    registrarMovimiento
}