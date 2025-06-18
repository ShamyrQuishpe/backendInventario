import {
  agregarProducto,
  listarProductos,
  listarProductoPorCodigoBarras,
  listarProductosPorResponsable,
  actualizarProducto,
  eliminarProducto
} from '../src/controllers/product_controller.js';

import Products from '../src/models/product.js';
import Categories from '../src/models/category.js';

jest.mock('../src/models/product.js');
jest.mock('../src/models/category.js');

describe('Controlador de productos', () => {
  const mockReq = {
    body: {
      codigoSerial: '123',
      categoriaNombre: 'Categoría X',
      nombreEquipo: 'Laptop',
      capacidad: '512GB',
      color: 'Negro'
    },
    user: {
      _id: 'usuario123',
      nombre: 'Juan',
      area: 'Almacen'
    },
    params: { codigoBarras: '111222333444' },
    query: {}
  };

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => jest.clearAllMocks());

  test('agregarProducto - debe agregar un producto correctamente', async () => {
    const req = { ...mockReq };
    const res = mockRes();

    Categories.findOne.mockResolvedValue({ _id: 'cat123', nombreCategoria: 'Categoría X' });
    Products.findOne.mockResolvedValue(null);
    Products.prototype.save = jest.fn().mockResolvedValue();

    await agregarProducto(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      msg: 'Producto agregado correctamente',
      producto: expect.any(Object)
    }));
  });

  test('listarProductos - retorna productos correctamente', async () => {
    const res = mockRes();
    Products.find.mockResolvedValue([{ nombreEquipo: 'PC' }]);

    await listarProductos({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ productos: expect.any(Array) });
  });

  test('listarProductoPorCodigoBarras - retorna producto por código', async () => {
    const req = { params: { codigoBarras: '123456' } };
    const res = mockRes();

    Products.findOne.mockResolvedValue({ nombreEquipo: 'Tablet' });

    await listarProductoPorCodigoBarras(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ producto: expect.any(Object) });
  });

  test('listarProductosPorResponsable - retorna productos por responsable', async () => {
    const req = { ...mockReq, query: {}, user: { _id: 'user123' } };
    const res = mockRes();

    Products.find.mockResolvedValue([{ nombreEquipo: 'Monitor' }]);

    await listarProductosPorResponsable(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  test('actualizarProducto - actualiza producto correctamente', async () => {
    const req = {
      ...mockReq,
      params: { codigoBarras: '123456' },
      body: {
        nombreEquipo: 'Actualizado',
        categoriaNombre: 'Categoría X'
      }
    };
    const res = mockRes();

    Products.findOne.mockResolvedValue({ save: jest.fn() });
    Categories.findOne.mockResolvedValue({ _id: 'cat123' });

    await actualizarProducto(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      msg: 'Producto actualizado correctamente',
      producto: expect.any(Object)
    }));
  });

  test('eliminarProducto - elimina producto correctamente', async () => {
    const req = { params: { codigoBarras: '123456' } };
    const res = mockRes();

    Products.findOneAndDelete.mockResolvedValue({});

    await eliminarProducto(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Producto eliminado correctamente' });
  });
});
