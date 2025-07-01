import {
  listarMovimientosPorFecha,
  listarProductosPorFecha,
  listarVentasPorFecha,
  listarAccesoriosPorFecha,
  listarStockDisponible
} from '../src/controllers/visualizaciones_controller.js';

import Movements from '../src/models/move.js';
import Products from '../src/models/product.js';
import Vents from '../src/models/vent.js';
import Accesories from '../src/models/accesory.js';

jest.mock('../src/models/move.js');
jest.mock('../src/models/product.js');
jest.mock('../src/models/vent.js');
jest.mock('../src/models/accesory.js');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe('Visualizaciones Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('listarMovimientosPorFecha debe retornar movimientos entre fechas', async () => {
    const mockMovimientos = [{ _id: 'm1', fecha: new Date() }];
    Movements.find.mockResolvedValue(mockMovimientos);

    const req = { query: { desde: '2024-01-01', hasta: '2024-01-02' } };
    const res = mockRes();

    await listarMovimientosPorFecha(req, res);

    expect(Movements.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockMovimientos);
  });

  test('listarProductosPorFecha debe retornar productos entre fechas', async () => {
    const mockProductos = [{ _id: 'p1', fechaIngreso: new Date() }];
    Products.find.mockResolvedValue(mockProductos);

    const req = { query: { desde: '2024-01-01', hasta: '2024-01-02' } };
    const res = mockRes();

    await listarProductosPorFecha(req, res);

    expect(Products.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockProductos);
  });

  test('listarVentasPorFecha debe retornar ventas entre fechas', async () => {
    const mockVentas = [{ _id: 'v1', fecha: new Date() }];
    Vents.find.mockResolvedValue(mockVentas);

    const req = { query: { desde: '2024-01-01', hasta: '2024-01-02' } };
    const res = mockRes();

    await listarVentasPorFecha(req, res);

    expect(Vents.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockVentas);
  });

  test('listarAccesoriosPorFecha debe retornar accesorios entre fechas', async () => {
    const mockAccesorios = [{ _id: 'a1', fechaIngreso: new Date() }];
    Accesories.find.mockResolvedValue(mockAccesorios);

    const req = { query: { desde: '2024-01-01', hasta: '2024-01-02' } };
    const res = mockRes();

    await listarAccesoriosPorFecha(req, res);

    expect(Accesories.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAccesorios);
  });
  
  test('listarStockDisponible debe retornar productos y accesorios agrupados', async () => {
    const productosMock = [
      { codigoModelo: '123', cantidad: 3, nombreEquipo: 'iPhone' }
    ];
    const accesoriosMock = [
      { codigoModeloAccs: 'A1', cantidad: 5, nombreAccs: 'Cable' }
    ];

    Products.aggregate.mockResolvedValue(productosMock);
    Accesories.aggregate.mockResolvedValue(accesoriosMock);

    const req = { query: { nombre: 'Galaxy', categoria: 'Telefonía' } };
    const res = mockRes();

    await listarStockDisponible(req, res);

    expect(Products.aggregate).toHaveBeenCalled();
    expect(Accesories.aggregate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      productos: productosMock,
      accesorios: accesoriosMock
    });
  });
});
