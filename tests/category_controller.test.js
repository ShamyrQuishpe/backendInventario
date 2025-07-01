import {
  crearCategoria,
  listarCategorias,
  actualizarCategorias,
  eliminarCategoria
} from '../src/controllers/category_controller.js';


import Categories from '../src/models/category.js';

jest.mock('../src/models/category.js');

describe('category_controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        nombreCategoria: 'Audio',
        descripcionCategoria: 'Dispositivos relacionados al sonido'
      },
      params: { id: 'cat123' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  // === crearCategoria ===
  test('crearCategoria - éxito', async () => {
    Categories.findOne.mockResolvedValue(null);
    Categories.prototype.save = jest.fn();

    await crearCategoria(req, res);

    expect(Categories.findOne).toHaveBeenCalledWith({ nombreCategoria: 'audio' });
    expect(Categories.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      msg: expect.any(String),
      categoria: expect.any(Object)
    }));
  });

  test('crearCategoria - campos incompletos', async () => {
    req.body = { nombreCategoria: '', descripcionCategoria: '' };

    await crearCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      msg: "Todos los campos son obligatorios"
    }));
  });

  test('crearCategoria - categoría ya existe', async () => {
    Categories.findOne.mockResolvedValue({ _id: 'existente' });

    await crearCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      msg: "El nombre de la categoría ya existe"
    }));
  });

  test('crearCategoria - error interno', async () => {
    Categories.findOne.mockRejectedValue(new Error('DB error'));

    await crearCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      msg: "Error al crear la categoría"
    }));
  });

  // === listarCategorias ===
  test('listarCategorias - éxito', async () => {
    Categories.find.mockResolvedValue([{ nombreCategoria: 'Audio' }]);

    await listarCategorias(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ nombreCategoria: 'Audio' }]);
  });

  test('listarCategorias - error interno', async () => {
    Categories.find.mockRejectedValue(new Error('DB error'));

    await listarCategorias(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      msg: "Error al obtener categorias"
    }));
  });

  // === actualizarCategorias ===
  test('actualizarCategorias - éxito', async () => {
    const categoria = {
      nombreCategoria: 'old',
      descripcionCategoria: 'old desc',
      save: jest.fn()
    };

    Categories.findById.mockResolvedValue(categoria);

    req.body = {
      nombreCategoria: 'nuevo audio',
      descripcionCategoria: 'nueva descripción'
    };

    await actualizarCategorias(req, res);

    expect(categoria.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      msg: "Categoria actualizada correctamente",
      categoria: expect.any(Object)
    }));
  });

  test('actualizarCategorias - no encontrada', async () => {
    Categories.findById.mockResolvedValue(null);

    await actualizarCategorias(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Categoria no encontrada" });
  });

  test('actualizarCategorias - error interno', async () => {
    Categories.findById.mockRejectedValue(new Error('DB error'));

    await actualizarCategorias(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ msg: "Error al actualizar la categoria" });
  });

  // === eliminarCategoria ===
  test('eliminarCategoria - éxito', async () => {
    Categories.findByIdAndDelete.mockResolvedValue({ _id: 'cat123' });

    await eliminarCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: "Categoria eliminada correctamente" });
  });

  test('eliminarCategoria - no encontrada', async () => {
    Categories.findByIdAndDelete.mockResolvedValue(null);

    await eliminarCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: "Categoria no encontrada" });
  });

  test('eliminarCategoria - error interno', async () => {
    Categories.findByIdAndDelete.mockRejectedValue(new Error('DB error'));

    await eliminarCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ msg: "Error al eliminar la categoria" });
  });
});
