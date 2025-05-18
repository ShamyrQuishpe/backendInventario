import Movements from '../models/move.js'
import Products from '../models/product.js'
import Vents from '../models/vent.js'
import Accesories from '../models/accesory.js'

const listarMovimientosPorFecha = async (req, res) => {
    try {
        const { desde, hasta } = req.query;

        let fechaInicio, fechaFin;

        if (!desde && !hasta) {
            // Por defecto: hoy
            const hoy = new Date();
            const mañana = new Date(hoy);
            mañana.setDate(hoy.getDate() + 1);

            fechaInicio = new Date(hoy.toISOString().split('T')[0]); // hoy a 00:00
            fechaFin = new Date(mañana.toISOString().split('T')[0]); // mañana a 00:00
        } else {
            fechaInicio = new Date((desde || new Date()).toString().split('T')[0]);

            if (hasta) {
                const siguienteDia = new Date(hasta);
                siguienteDia.setDate(siguienteDia.getDate() + 1); // Día después de "hasta"
                fechaFin = new Date(siguienteDia.toISOString().split('T')[0]);
            } else {
                const siguienteDia = new Date(fechaInicio);
                siguienteDia.setDate(siguienteDia.getDate() + 1);
                fechaFin = new Date(siguienteDia.toISOString().split('T')[0]);
            }
        }

        const movimientos = await Movements.find({
            fecha: {
                $gte: fechaInicio,
                $lte: fechaFin
            }
        });

        res.status(200).json(movimientos);
    } catch (error) {
        console.error('Error al listar movimientos:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const listarProductosPorFecha = async (req, res) => {
    try {
        const { desde, hasta } = req.query;

        let fechaInicio, fechaFin;

        if (!desde && !hasta) {
            // Por defecto: hoy
            const hoy = new Date();
            const mañana = new Date(hoy);
            mañana.setDate(hoy.getDate() + 1);

            fechaInicio = new Date(hoy.toISOString().split('T')[0]); // hoy a 00:00
            fechaFin = new Date(mañana.toISOString().split('T')[0]); // mañana a 00:00
        } else {
            fechaInicio = new Date((desde || new Date()).toString().split('T')[0]);

            if (hasta) {
                const siguienteDia = new Date(hasta);
                siguienteDia.setDate(siguienteDia.getDate() + 1); // Día después de "hasta"
                fechaFin = new Date(siguienteDia.toISOString().split('T')[0]);
            } else {
                const siguienteDia = new Date(fechaInicio);
                siguienteDia.setDate(siguienteDia.getDate() + 1);
                fechaFin = new Date(siguienteDia.toISOString().split('T')[0]);
            }
        }

        const productos = await Products.find({
            fechaIngreso: {
                $gte: fechaInicio,
                $lt: fechaFin // usamos $lt y no $lte para cubrir todo el último día
            }
        });

        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al listar productos por fecha:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};


const listarVentasPorFecha = async (req, res) => {
    try {
        const { desde, hasta } = req.query;

        let fechaInicio, fechaFin;

        if (!desde && !hasta) {
            // Por defecto: hoy
            const hoy = new Date();
            const mañana = new Date(hoy);
            mañana.setDate(hoy.getDate() + 1);

            fechaInicio = new Date(hoy.toISOString().split('T')[0]); // hoy a 00:00
            fechaFin = new Date(mañana.toISOString().split('T')[0]); // mañana a 00:00
        } else {
            fechaInicio = new Date((desde || new Date()).toString().split('T')[0]);

            if (hasta) {
                const siguienteDia = new Date(hasta);
                siguienteDia.setDate(siguienteDia.getDate() + 1); // Día después de "hasta"
                fechaFin = new Date(siguienteDia.toISOString().split('T')[0]);
            } else {
                const siguienteDia = new Date(fechaInicio);
                siguienteDia.setDate(siguienteDia.getDate() + 1);
                fechaFin = new Date(siguienteDia.toISOString().split('T')[0]);
            }
        }

        const ventas = await Vents.find({
            fecha: {
                $gte: fechaInicio,
                $lte: fechaFin
            }
        });

        res.status(200).json(ventas);
    } catch (error) {
        console.error('Error al listar ventas por fecha:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const listarAccesoriosPorFecha = async (req, res) => {
    try {
        const { desde, hasta } = req.query;

        let fechaInicio, fechaFin;

        if (!desde && !hasta) {
            // Por defecto: hoy
            const hoy = new Date();
            const mañana = new Date(hoy);
            mañana.setDate(hoy.getDate() + 1);

            fechaInicio = new Date(hoy.toISOString().split('T')[0]); // hoy a 00:00
            fechaFin = new Date(mañana.toISOString().split('T')[0]); // mañana a 00:00
        } else {
            fechaInicio = new Date((desde || new Date()).toString().split('T')[0]);

            if (hasta) {
                const siguienteDia = new Date(hasta);
                siguienteDia.setDate(siguienteDia.getDate() + 1); // Día después de "hasta"
                fechaFin = new Date(siguienteDia.toISOString().split('T')[0]);
            } else {
                const siguienteDia = new Date(fechaInicio);
                siguienteDia.setDate(siguienteDia.getDate() + 1);
                fechaFin = new Date(siguienteDia.toISOString().split('T')[0]);
            }
        }

        const accesorios = await Accesories.find({
            fechaIngreso: {
                $gte: fechaInicio,
                $lte: fechaFin
            }
        });

        res.status(200).json(accesorios);
    } catch (error) {
        console.error('Error al listar accesorios por fecha:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const listarStockDisponible = async (req, res) => {
    try {
        const { nombre, capacidad, categoria } = req.query;

        // === Filtro base para productos ===
        const matchProductos = {
            estado: 'Disponible'
        };

        if (nombre) {
            matchProductos.nombreEquipo = { $regex: nombre, $options: 'i' };
        }

        if (capacidad) {
            matchProductos.capacidad = capacidad;
        }

        if (categoria) {
            matchProductos['categoriaNombre.nombreCategoria'] = { $regex: categoria, $options: 'i' };
        }

        const productosAgrupados = await Products.aggregate([
            { $match: matchProductos },
            {
                $group: {
                    _id: '$codigoModelo',
                    cantidad: { $sum: 1 },
                    nombreEquipo: { $first: '$nombreEquipo' },
                    capacidad: { $first: '$capacidad' },
                    color: { $first: '$color' },
                    precio: { $first: '$precio' },
                    tipo: { $first: '$tipo' },
                    categoria: { $first: { $arrayElemAt: ['$categoriaNombre.nombreCategoria', 0] } },
                    locacion: { $first: '$locacion' }
                }
            },
            {
                $project: {
                    _id: 0,
                    codigoModelo: '$_id',
                    nombreEquipo: 1,
                    capacidad: 1,
                    color: 1,
                    precio: 1,
                    tipo: 1,
                    categoria: 1,
                    locacion: 1,
                    cantidad: 1
                }
            },
            {
                $sort: { cantidad: -1 } // Opcional: ordena por cantidad descendente
            }
        ]);

        // === Filtro base para accesorios ===
        const matchAccesorios = {
            disponibilidadAccs: 'Disponible'
        };

        if (nombre) {
            matchAccesorios.nombreAccs = { $regex: nombre, $options: 'i' };
        }

        const accesoriosAgrupados = await Accesories.aggregate([
            { $match: matchAccesorios },
            {
                $group: {
                    _id: '$codigoModeloAccs',
                    cantidad: { $sum: 1 },
                    nombreAccs: { $first: '$nombreAccs' },
                    precioAccs: { $first: '$precioAccs' },
                    locacionAccs: { $first: '$locacionAccs' }
                }
            },
            {
                $project: {
                    _id: 0,
                    codigoModeloAccs: '$_id',
                    nombreAccs: 1,
                    precioAccs: 1,
                    locacionAccs: 1,
                    cantidad: 1
                }
            },
            {
                $sort: { cantidad: -1 } // Opcional
            }
        ]);

        res.status(200).json({
            productos: productosAgrupados,
            accesorios: accesoriosAgrupados
        });
    } catch (error) {
        console.error('Error al listar stock disponible agrupado:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export {
    listarMovimientosPorFecha,
    listarProductosPorFecha,
    listarVentasPorFecha,
    listarAccesoriosPorFecha,
    listarStockDisponible
}