import {
  loginUsuario,
  registroUsuario,
  perfilUsuario,
  listarUsuarios,
  detalleUsuario,
  nuevaPassword,
  actualizarUsuario,
  eliminarUsuario,
  cambiarPasswordTemporal,
  listarAreasUnicas
} from '../src/controllers/user_controller.js';

import Users from '../src/models/user.js';
import generarJWT from '../src/helpers/JWT.js';
import jwt from 'jsonwebtoken';
import sendMailToUser from '../src/config/nodemailer.js';

jest.mock('../src/models/user.js');
jest.mock('../src/helpers/JWT.js');
jest.mock('jsonwebtoken');
jest.mock('../src/config/nodemailer.js');

describe("User Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('loginUsuario - error por campos vacíos', async () => {
    req.body = { email: '', password: '123456' };

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: expect.any(String) });
  });

  test('loginUsuario - login exitoso', async () => {
    req.body = { email: 'test@example.com', password: '123456' };

    const fakeUser = {
      _id: 'abc123',
      nombre: 'Test',
      apellido: 'User',
      rol: 'admin',
      area: 'TI',
      telefono: '123456789',
      email: 'test@example.com',
      matchPassword: jest.fn().mockResolvedValue(true)
    };

    Users.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(fakeUser)
    });

    generarJWT.mockReturnValue('fake-jwt-token');

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: 'fake-jwt-token',
      email: 'test@example.com'
    }));
  });

  test('registroUsuario - registro y correo exitoso', async () => {
    req.body = {
      email: 'nuevo@ejemplo.com',
      nombre: 'Nuevo',
      password: '123456'
    };

    Users.findOne.mockResolvedValue(null);

    const mockSave = jest.fn().mockResolvedValue({});
    const mockEncrypt = jest.fn().mockResolvedValue('encryptedPass');

    Users.mockImplementation(() => ({
      save: mockSave,
      encrypPassword: mockEncrypt,
      email: req.body.email
    }));

    jwt.sign.mockReturnValue('fake-token');

    await registroUsuario(req, res);

    expect(sendMailToUser).toHaveBeenCalledWith(
      req.body.email,
      expect.any(String),
      'fake-token',
      req.body.nombre
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: expect.stringContaining('Usuario registrado')
    });
  });

  test('perfilUsuario - retorna perfil', async () => {
  req.user._id = '123';

  Users.findById.mockReturnValue({
    select: jest.fn().mockResolvedValue({
      nombre: 'Juan',
      apellido: 'Pérez',
      rol: 'vendedor',
      area: 'TI'
    })
  });

  await perfilUsuario(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    nombre: 'Juan',
    apellido: 'Pérez',
    rol: 'vendedor',
    area: 'TI'
  }));
});


  test('listarUsuarios - lista usuarios', async () => {
    const fakeUsers = [{ nombre: 'A' }, { nombre: 'B' }];
    Users.find.mockResolvedValue(fakeUsers);

    await listarUsuarios(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeUsers);
  });

  test('detalleUsuario - devuelve detalle por cédula', async () => {
    req.params.cedula = '123';
    Users.findOne.mockResolvedValue({ nombre: 'Pedro' });

    await detalleUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ nombre: 'Pedro' });
  });

  test('nuevaPassword - cambia correctamente', async () => {
    req.params.cedula = '123';
    req.body = {
      passwordnuevo: 'nueva123',
      repetirpassword: 'nueva123'
    };

    const mockUser = {
      encrypPassword: jest.fn().mockResolvedValue('hashed'),
      save: jest.fn().mockResolvedValue()
    };

    Users.findOne.mockResolvedValue(mockUser);

    await nuevaPassword(req, res);

    expect(mockUser.encrypPassword).toHaveBeenCalledWith('nueva123');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('actualizarUsuario - actualiza correctamente', async () => {
    req.params.cedula = '123';
    req.body = {
      telefono: '1234',
      area: 'TI',
      rol: 'admin',
      status: 'activo'
    };

    Users.findOne.mockResolvedValue({ cedula: '123' });
    Users.updateOne.mockResolvedValue({});

    await actualizarUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('eliminarUsuario - elimina correctamente', async () => {
    req.params.cedula = '123';
    Users.findOneAndDelete.mockResolvedValue({});

    await eliminarUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: expect.stringContaining("Usuario eliminado")
    });
  });

  test('cambiarPasswordTemporal - éxito al cambiar', async () => {
    req.params.token = 'fake-token';
    req.body = { passwordnuevo: 'clave123' };

    jwt.verify.mockReturnValue({ email: 'user@test.com' });

    const mockUser = {
      encrypPassword: jest.fn().mockResolvedValue('hashed'),
      save: jest.fn().mockResolvedValue()
    };

    Users.findOne.mockResolvedValue(mockUser);

    await cambiarPasswordTemporal(req, res);

    expect(mockUser.encrypPassword).toHaveBeenCalledWith('clave123');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('listarAreasUnicas - retorna áreas distintas', async () => {
    const fakeAreas = ['TI', 'RRHH'];
    Users.distinct.mockResolvedValue(fakeAreas);

    await listarAreasUnicas(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeAreas);
  });
});
