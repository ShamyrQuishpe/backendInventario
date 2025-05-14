import Movements from '../models/move.js'
import Products from '../models/product.js'
import Vents from '../models/vent.js'
import Accesories from '../models/accesory.js'

const listarMovimientosPorFecha = async (req, res) => {
    try {
        const { fecha } = req.query;

        let fechaInicio;
        let fechaFin;

        if (fecha) {
            fechaInicio = new Date(fecha);
        } else {
            const hoy = new Date();
            fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        }

        fechaFin = new Date(fechaInicio);
        fechaFin.setHours(23, 59, 59, 999);

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
        const { fecha } = req.query;

        let fechaInicio;
        let fechaFin;

        if (fecha) {
            fechaInicio = new Date(fecha);
        } else {
            const hoy = new Date();
            fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        }

        // Fin del día
        fechaFin = new Date(fechaInicio);
        fechaFin.setHours(23, 59, 59, 999);

        const productos = await Products.find({
            fechaIngreso: {
                $gte: fechaInicio,
                $lte: fechaFin
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
        const { fecha } = req.query;

        let fechaInicio;
        let fechaFin;

        if (fecha) {
            fechaInicio = new Date(fecha);
        } else {
            const hoy = new Date();
            fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        }

        fechaFin = new Date(fechaInicio);
        fechaFin.setHours(23, 59, 59, 999);

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
        const { fecha } = req.query;

        let fechaInicio;
        let fechaFin;

        if (fecha) {
            fechaInicio = new Date(fecha);
        } else {
            const hoy = new Date();
            fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        }

        fechaFin = new Date(fechaInicio);
        fechaFin.setHours(23, 59, 59, 999);

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

        // === Filtro para productos ===
        const filtroProductos = {
            estado: 'Disponible'
        };

        if (nombre) {
            filtroProductos.nombreEquipo = { $regex: nombre, $options: 'i' };
        }

        if (capacidad) {
            filtroProductos.capacidad = capacidad;
        }

        if (categoria) {
            filtroProductos['categoriaNombre.nombreCategoria'] = { $regex: categoria, $options: 'i' };
        }

        const productos = await Products.find(filtroProductos);

        // === Filtro para accesorios ===
        const filtroAccesorios = {
            disponibilidadAccs: 'Disponible'
        };

        if (nombre) {
            filtroAccesorios.nombreAccs = { $regex: nombre, $options: 'i' };
        }

        const accesorios = await Accesories.find(filtroAccesorios);

        res.status(200).json({
            productos,
            accesorios
        });
    } catch (error) {
        console.error('Error al listar stock disponible:', error);
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