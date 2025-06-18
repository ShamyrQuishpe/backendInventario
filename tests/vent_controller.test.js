/**
 * __tests__/vent_controller.test.js
 */

import {
  registrarVenta,
  listarVentasPorVendedor,
  detalleVenta,
  actualizarVenta,
  eliminarVenta
} from '../src/controllers/vent_controller.js';

import Vents from '../src/models/vent.js';
import Products from '../src/models/product.js';
import Accesories from '../src/models/accesory.js';

jest.mock('../src/models/vent.js');
jest.mock('../src/models/product.js');
jest.mock('../src/models/accesory.js');

describe('Vents Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  // ====== registrarVenta ======
  describe('registrarVenta', () => {
    test('Debe retornar 400 si cliente incompleto', async () => {
      req.body = { cliente: { cedula: '', nombre: '' }, productos: [], accesorios: [], metodoPago: 'efectivo' };
      await registrarVenta(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "Información del cliente incompleta" });
    });

    test('Debe retornar 400 si no hay productos ni accesorios', async () => {
      req.body = { cliente: { cedula: '123', nombre: 'Juan' }, productos: [], accesorios: [], metodoPago: 'efectivo' };
      await registrarVenta(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "Debes agregar al menos un producto o un accesorio" });
    });

    test('Debe retornar 400 si metodoPago es transferencia y faltan datos', async () => {
      req.body = {
        cliente: { cedula: '123', nombre: 'Juan' },
        productos: [{ codigoBarras: 'prod1' }],
        accesorios: [],
        metodoPago: 'transferencia',
        numeroDocumento: null,
        descripcionDocumento: null
      };
      await registrarVenta(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "Debes ingresar número y descripción del documento para pagos por transferencia" });
    });

    test('Debe retornar 404 si producto no existe', async () => {
      req.body = {
        cliente: { cedula: '123', nombre: 'Juan' },
        productos: [{ codigoBarras: 'prod1' }],
        accesorios: [],
        metodoPago: 'efectivo'
      };

      Products.findOne.mockResolvedValue(null); // producto no encontrado

      await registrarVenta(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "Producto con código prod1 no encontrado" });
    });

    test('Debe retornar 400 si producto no está disponible', async () => {
      req.body = {
        cliente: { cedula: '123', nombre: 'Juan' },
        productos: [{ codigoBarras: 'prod1' }],
        accesorios: [],
        metodoPago: 'efectivo'
      };

      Products.findOne.mockResolvedValue({ estado: "No disponible", _id: 'p1', codigoBarras: 'prod1', nombreEquipo: 'Equipo', capacidad: '128GB', color: 'Negro', codigoSerial: '123', precio: 100 });

      await registrarVenta(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "Producto con código prod1 ya fue vendido" });
    });

    test('Debe retornar 404 si accesorio no existe', async () => {
      req.body = {
        cliente: { cedula: '123', nombre: 'Juan' },
        productos: [],
        accesorios: [{ codigoBarrasAccs: 'acc1' }],
        metodoPago: 'efectivo'
      };

      Accesories.findOne.mockResolvedValue(null);

      await registrarVenta(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "Producto con código undefined no encontrado" }); // ojo, en tu código usas item.codigoBarras en el mensaje pero deberías corregirlo a codigoBarrasAccs
    });

    test('Debe retornar 400 si accesorio no está disponible', async () => {
      req.body = {
        cliente: { cedula: '123', nombre: 'Juan' },
        productos: [],
        accesorios: [{ codigoBarrasAccs: 'acc1' }],
        metodoPago: 'efectivo'
      };

      Accesories.findOne.mockResolvedValue({ disponibilidadAccs: "No disponible", _id: 'a1', codigoBarrasAccs: 'acc1', nombreAccs: 'Accesorio', precioAccs: 50 });

      await registrarVenta(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "Producto con código undefined ya fue vendido" }); // mismo detalle mensaje
    });

    test('Debe retornar 400 si descuento es mayor al total', async () => {
      req.body = {
        cliente: { cedula: '123', nombre: 'Juan' },
        productos: [{ codigoBarras: 'prod1' }],
        accesorios: [],
        metodoPago: 'efectivo',
        descuento: 200
      };

      Products.findOne.mockResolvedValue({ estado: "Disponible", _id: 'p1', codigoBarras: 'prod1', nombreEquipo: 'Equipo', capacidad: '128GB', color: 'Negro', codigoSerial: '123', precio: 100, save: jest.fn() });

      req.user = { _id: 'user123', nombre: 'Vendedor1' };

      await registrarVenta(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "El descuento no puede ser mayor a el total de la venta" });
    });

    test('Debe registrar venta correctamente', async () => {
      req.body = {
        cliente: { cedula: '123', nombre: 'Juan' },
        productos: [{ codigoBarras: 'prod1' }],
        accesorios: [{ codigoBarrasAccs: 'acc1' }],
        metodoPago: 'efectivo',
        descuento: 10
      };

      // Mock productos y accesorios disponibles
      const mockProducto = { 
        estado: "Disponible", _id: 'p1', codigoBarras: 'prod1', nombreEquipo: 'Equipo', capacidad: '128GB', color: 'Negro', codigoSerial: '123', precio: 100, 
        save: jest.fn()
      };
      const mockAccesorio = {
        disponibilidadAccs: "Disponible", _id: 'a1', codigoBarrasAccs: 'acc1', nombreAccs: 'Accesorio', precioAccs: 50,
        save: jest.fn()
      };

      Products.findOne.mockResolvedValue(mockProducto);
      Accesories.findOne.mockResolvedValue(mockAccesorio);
      Vents.prototype.save = jest.fn().mockResolvedValue();

      req.user = { _id: 'user123', nombre: 'Vendedor1' };

      await registrarVenta(req, res);

      expect(mockProducto.save).toHaveBeenCalled();
      expect(mockAccesorio.save).toHaveBeenCalled();

      expect(Vents.prototype.save).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        msg: "Venta registrada exitosamente",
        venta: expect.any(Object)
      }));
    });

    test('Debe revertir productos si hay error al registrar', async () => {
      req.body = {
        cliente: { cedula: '123', nombre: 'Juan' },
        productos: [{ codigoBarras: 'prod1' }],
        accesorios: [],
        metodoPago: 'efectivo',
      };

      const mockProducto = { 
        estado: "Disponible", _id: 'p1', codigoBarras: 'prod1', nombreEquipo: 'Equipo', capacidad: '128GB', color: 'Negro', codigoSerial: '123', precio: 100, 
        save: jest.fn()
      };

      Products.findOne.mockResolvedValue(mockProducto);

      // Forzar error en el save de Vents
      Vents.prototype.save = jest.fn(() => { throw new Error('Error de BD'); });

      // Mock revertir con findByIdAndUpdate
      Products.findByIdAndUpdate = jest.fn().mockResolvedValue();

      req.user = { _id: 'user123', nombre: 'Vendedor1' };

      await registrarVenta(req, res);

      expect(Products.findByIdAndUpdate).toHaveBeenCalledWith('p1', { estado: "Disponible" });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: "Ocurrió un error al registrar la venta, los productos fueron revertidos" });
    });
  });

  // ====== listarVentasPorVendedor ======
  describe('listarVentasPorVendedor', () => {
    test('Debe retornar 401 si usuario no autenticado', async () => {
      req.usuario = null;
      await listarVentasPorVendedor(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no autenticado' });
    });

    test('Debe listar ventas correctamente con fechas por defecto', async () => {
      req.usuario = { _id: 'user123' };
      req.user = { _id: 'user123' };
      req.query = {};

      const mockVentas = [{ _id: 'venta1' }, { _id: 'venta2' }];
      Vents.find.mockResolvedValue(mockVentas);

      await listarVentasPorVendedor(req, res);

      expect(Vents.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockVentas);
    });

    test('Debe retornar 500 si falla la consulta', async () => {
      req.usuario = { _id: 'user123' };
      req.user = { _id: 'user123' };
      req.query = {};
      Vents.find.mockRejectedValue(new Error('Error DB'));

      await listarVentasPorVendedor(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error del servidor' });
    });
  });

  // ====== detalleVenta ======
  describe('detalleVenta', () => {
    test('Debe retornar 404 si venta no encontrada', async () => {
      req.params = { id: 'venta123' };
      Vents.findById.mockResolvedValue(null);

      await detalleVenta(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "Venta no encontrada" });
    });

    test('Debe retornar venta si encontrada', async () => {
      req.params = { id: 'venta123' };
      const ventaMock = { _id: 'venta123', cliente: { nombre: 'Cliente' } };
      Vents.findById.mockResolvedValue(ventaMock);

      await detalleVenta(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(ventaMock);
    });

    test('Debe retornar 500 si error en DB', async () => {
      req.params = { id: 'venta123' };
      Vents.findById.mockRejectedValue(new Error('Error DB'));

      await detalleVenta(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: "Error al obtener el detalle de la venta" });
    });
  });

  // ====== actualizarVenta ======
  describe('actualizarVenta', () => {
    test('Debe retornar 404 si venta no encontrada', async () => {
      req.params = { id: 'venta123' };
      req.body = { observacion: 'nueva', metodoPago: 'efectivo' };
      Vents.findByIdAndUpdate.mockResolvedValue(null);

      await actualizarVenta(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "Venta no encontrada" });
    });

    test('Debe actualizar venta correctamente', async () => {
      req.params = { id: 'venta123' };
      req.body = { observacion: 'nueva', metodoPago: 'efectivo' };
      const ventaActualizadaMock = { _id: 'venta123', observacion: 'nueva', metodoPago: 'efectivo' };
      Vents.findByIdAndUpdate.mockResolvedValue(ventaActualizadaMock);

      await actualizarVenta(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: "Venta actualizada correctamente", venta: ventaActualizadaMock });
    });

    test('Debe retornar 500 si error en DB', async () => {
      req.params = { id: 'venta123' };
      req.body = { observacion: 'nueva', metodoPago: 'efectivo' };
      Vents.findByIdAndUpdate.mockRejectedValue(new Error('Error DB'));

      await actualizarVenta(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: "Error al actualizar la venta" });
    });
  });

  // ====== eliminarVenta ======
  describe('eliminarVenta', () => {
    test('Debe retornar 404 si venta no encontrada', async () => {
      req.params = { id: 'venta123' };
      Vents.findById.mockResolvedValue(null);

      await eliminarVenta(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "Venta no encontrada" });
    });

    test('Debe eliminar venta y revertir productos', async () => {
      req.params = { id: 'venta123' };
      const mockVenta = {
        productos: [
          { producto: 'prod1' },
          { producto: 'prod2' }
        ],
        deleteOne: jest.fn().mockResolvedValue()
      };
      Vents.findById.mockResolvedValue(mockVenta);
      Products.findByIdAndUpdate.mockResolvedValue();

      await eliminarVenta(req, res);

      expect(Products.findByIdAndUpdate).toHaveBeenCalledTimes(2);
      expect(mockVenta.deleteOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: "Venta eliminada correctamente y productos revertidos" });
    });

    test('Debe retornar 500 si error en DB', async () => {
      req.params = { id: 'venta123' };
      Vents.findById.mockRejectedValue(new Error('Error DB'));

      await eliminarVenta(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: "Error al eliminar la venta" });
    });
  });

});
