import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../db/models/user';

export default class UserController {

  static async createUser(req: Request, res: Response) {
    try {
      const { name, email, password, role_id } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          status: 400,
          message: 'Campos incompletos.',
        });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: 400,
          message: 'El correo ya está registrado.',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });

      const decoded = jwt.decode(token) as jwt.JwtPayload;
      const expirationUTC = new Date(decoded.exp! * 1000);
      const expirationLocal = new Date(expirationUTC.getTime() - expirationUTC.getTimezoneOffset() * 60000);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        jwt_token: token,
        role_id: role_id || 1, 
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return res.status(201).json({
        status: 201,
        message: 'Usuario creado correctamente.',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role_id: newUser.role_id,
        },
        token,
        tokenExpiration: expirationLocal,
      });
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      return res.status(500).json({
        status: 500,
        message: 'Error al crear el usuario.',
        error: error.message,
      });
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const users = await User.findAll();
      return res.status(200).json({
        status: 200,
        message: 'Usuarios obtenidos correctamente.',
        users,
      });
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      return res.status(500).json({
        status: 500,
        message: 'Error al obtener los usuarios.',
        error: error.message,
      });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findOne({ where: { id }, paranoid: false }); // Paranoid en false para incluir eliminados

      if (!user) {
        return res.status(404).json({
          status: 404,
          message: 'Usuario no encontrado.',
        });
      }

      return res.status(200).json({
        status: 200,
        message: 'Usuario encontrado.',
        user,
      });
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      return res.status(500).json({
        status: 500,
        message: 'Error al obtener el usuario.',
        error: error.message,
      });
    }
  }

  static async getCurrentUser(req: Request, res: Response) {
    try {
      // Obtener el token del encabezado de la solicitud
      const token = req.header('Authorization')?.replace('Bearer ', '');
  
      if (!token) {
        return res.status(401).json({
          status: 401,
          message: 'No se proporcionó un token de autenticación.',
        });
      }
  
      // Verificar y decodificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
  
      // Buscar el usuario basado en el correo (o cualquier otro dato que decodifiques del token)
      const user = await User.findOne({ where: { email: decoded.email }, paranoid: false });
  
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: 'Usuario no encontrado.',
        });
      }
  
      return res.status(200).json({
        status: 200,
        message: 'Usuario encontrado.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role_id: user.role_id,
          // Agrega más datos que consideres necesarios
        },
      });
    } catch (error) {
      console.error('Error al obtener el usuario con sesión activa:', error);
      return res.status(500).json({
        status: 500,
        message: 'Error al obtener el usuario con sesión activa.',
        error: error.message,
      });
    }
  }
  
  
  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, phone, password, role_id } = req.body;

      const user = await User.findOne({ where: { id }, paranoid: false }); 

      if (!user) {
        return res.status(404).json({
          status: 404,
          message: 'Usuario no encontrado.',
        });
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = await bcrypt.hash(password, 10);
      if (role_id) user.role_id = role_id;

      user.updatedAt = new Date();
      await user.save();

      return res.status(200).json({
        status: 200,
        message: 'Usuario actualizado correctamente.',
        user,
      });
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      return res.status(500).json({
        status: 500,
        message: 'Error al actualizar el usuario.',
        error: error.message,
      });
    }
  }

static async deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'Usuario no encontrado.',
      });
    }
    user.activo = false;
    user.updatedAt = new Date();
    await user.save();

    return res.status(200).json({
      status: 200,
      message: 'Usuario desactivado correctamente.',
    });
  } catch (error) {
    console.error('Error al desactivar el usuario:', error);
    return res.status(500).json({
      status: 500,
      message: 'Error al desactivar el usuario.',
      error: error.message,
    });
  }
}
}
