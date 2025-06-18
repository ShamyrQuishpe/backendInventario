import {
  agregarAccesorio,
  listarAccesorios,
  listarAccesoriosPorResponsable,
  detalleAccesorio,
  actualizarAccesorio,
  eliminarAccesorio
} from '../src/controllers/accesory_controller.js';

import Accesories from '../src/models/accesory.js';
import Products from '../src/models/product.js';
import Categories from '../src/models/category.js';

jest.mock('../src/models/accesory.js');
jest.mock('../src/models/product.js');
jest.mock('../src/models/category.js');

describe('accesory_controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        codigoModeloAccs: 'A1',
        categoriaNombre: 'Audio',
        nombreAccs: 'Auriculares',
        precioAccs: 25
      },
      params: { codigoBarras: '1234567890123' },
      user: {
        _id: 'user123',
        nombre: 'Usuario Prueba',
        area: 'Bodega'
      },
      query: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('agregarAccesorio - éxito', async () => {
    Categories.findOne.mockResolvedValue({ _id: 'cat123' });
    Products.findOne.mockResolvedValue(null);
    Accesories.findOne.mockResolvedValue(null);
    Accesories.prototype.save = jest.fn();

    await agregarAccesorio(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      msg: expect.any(String),
      accesorio: expect.any(Object)
    }));
  });

  test('listarAccesorios - éxito', async () => {
    Accesories.find.mockResolvedValue([{ nombreAccs: 'Teclado' }]);

    await listarAccesorios(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  test('listarAccesoriosPorResponsable - con fechas vacías', async () => {
    Accesories.find.mockResolvedValue([{ nombreAccs: 'Mouse' }]);

    await listarAccesoriosPorResponsable(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  test('detalleAccesorio - accesorio encontrado', async () => {
    Accesories.findOne.mockResolvedValue({ nombreAccs: 'Monitor' });

    await detalleAccesorio(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ accesorio: { nombreAccs: 'Monitor' } });
  });

  test('detalleAccesorio - accesorio no encontrado', async () => {
    Accesories.findOne.mockResolvedValue(null);

    await detalleAccesorio(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      msg: expect.any(String)
    }));
  });

  test('actualizarAccesorio - accesorio encontrado', async () => {
    const accesorio = {
      save: jest.fn(),
      codigoUnicoAccs: 'X1',
      nombreAccs: 'OldName',
      precioAccs: 20,
      disponibilidadAccs: 'Disponible'
    };

    Accesories.findOne.mockResolvedValue(accesorio);

    req.body = {
      codigoUnicoAccs: 'X2',
      nombreAccs: 'NewName',
      precioAccs: 30,
      disponibilidadAccs: 'Agotado'
    };

    await actualizarAccesorio(req, res);

    expect(accesorio.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      msg: expect.any(String)
    }));
  });

  test('eliminarAccesorio - accesorio encontrado', async () => {
    Accesories.findOneAndDelete.mockResolvedValue({ codigoBarrasAccs: '123' });

    await eliminarAccesorio(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      msg: expect.any(String)
    }));
  });

  test('eliminarAccesorio - accesorio no encontrado', async () => {
    Accesories.findOneAndDelete.mockResolvedValue(null);

    await eliminarAccesorio(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      msg: expect.any(String)
    }));
  });
});
