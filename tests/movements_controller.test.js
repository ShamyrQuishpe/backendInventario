import {
  registrarMovimiento,
  listarMovimientosPorResponsable,
  listarMovimientoPorId,
  actualizarMovimiento,
  eliminarMovimiento
} from '../src/controllers/movements_controller.js';

import Movements from '../src/models/move.js';
import Products from '../src/models/product.js';
import Accesories from '../src/models/accesory.js';

jest.mock('../src/models/move.js');
jest.mock('../src/models/product.js');
jest.mock('../src/models/accesory.js');

describe('movements_controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: {
        _id: 'user123',
        nombre: 'Usuario de Prueba',
        area: 'Bodega'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('registrarMovimiento - sin productos ni accesorios', async () => {
    req.body = { productos: [], accesorios: [] };

    await registrarMovimiento(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: expect.stringContaining('al menos un producto') });
  });

  test('listarMovimientosPorResponsable - sin fechas', async () => {
    Movements.find.mockResolvedValue([{ areaSalida: 'Bodega' }]);

    await listarMovimientosPorResponsable(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  test('listarMovimientoPorId - encontrado', async () => {
    req.params.id = 'id123';
    Movements.findById.mockResolvedValue({ _id: 'id123' });

    await listarMovimientoPorId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ _id: 'id123' });
  });

  test('listarMovimientoPorId - no encontrado', async () => {
    req.params.id = 'id123';
    Movements.findById.mockResolvedValue(null);

    await listarMovimientoPorId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Movimiento no encontrado' });
  });

  test('actualizarMovimiento - sin observación válida', async () => {
    req.params.id = 'id123';
    req.body.observacion = 123;

    await actualizarMovimiento(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Debes enviar una observación válida' });
  });

  test('actualizarMovimiento - éxito', async () => {
    req.params.id = 'id123';
    req.body.observacion = 'Nueva observación';
    Movements.findByIdAndUpdate.mockResolvedValue({ _id: 'id123', observacion: 'Nueva observación' });

    await actualizarMovimiento(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ msg: 'Observación actualizada' }));
  });

  test('eliminarMovimiento - encontrado', async () => {
    req.params.id = 'id123';
    Movements.findByIdAndDelete.mockResolvedValue({ _id: 'id123' });

    await eliminarMovimiento(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Movimiento eliminado correctamente' });
  });

  test('eliminarMovimiento - no encontrado', async () => {
    req.params.id = 'id123';
    Movements.findByIdAndDelete.mockResolvedValue(null);

    await eliminarMovimiento(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Movimiento no encontrado' });
  });
});
