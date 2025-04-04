import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../db/models/user'; 
import dotenv from 'dotenv';

dotenv.config();

export default class AuthController {
  static async registerUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ status: 400, message: 'Campos incompletos.' });
      }
      const existingUser = await User.findOne({ where: { email }, paranoid: false });
      if (existingUser) {
        if (existingUser.deletedAt) {
          return res.status(400).json({
            status: 400,
            message: 'El correo ya fue registrado y está eliminado. Contacta al administrador.',
          });
        }
        return res.status(400).json({ status: 400, message: 'El correo ya está registrado.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      const expirationLocal = new Date(decoded.exp! * 1000);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        activo: true,
        jwt_token: token,
        role_id: 1,
      });

      return res.status(201).json({
        status: 201,
        message: 'Usuario registrado correctamente.',
        user: { id: newUser.id, name: newUser.name, email: newUser.email, activo: newUser.activo, role_id: newUser.role_id },
        token,
        tokenExpiration: expirationLocal,
      });
    } catch (error) {
      console.error('Error en el registro:', error);
      return res.status(500).json({ status: 500, message: 'Error al registrar el usuario.', error: error.message });
    }
  }

  static async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ status: 400, message: 'Correo y contraseña son obligatorios.' });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (!existingUser || existingUser.deletedAt) {
        return res.status(404).json({ status: 404, message: 'Credenciales inválidas o cuenta eliminada.' });
      }

      if (!existingUser.activo) {
        return res.status(403).json({ status: 403, message: 'Tu cuenta está inactiva. Contacta al administrador.' });
      }

      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(401).json({ status: 401, message: 'Credenciales inválidas.' });
      }

      const token = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      const expirationLocal = new Date(decoded.exp! * 1000);

      existingUser.jwt_token = token;
      await existingUser.save();

      return res.status(200).json({
        status: 200,
        message: 'Inicio de sesión exitoso.',
        user: { id: existingUser.id, name: existingUser.name, email: existingUser.email, role_id: existingUser.role_id },
        token,
        tokenExpiration: expirationLocal,
      });
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      return res.status(500).json({ status: 500, message: 'Error al iniciar sesión.', error: error.message });
    }
  }

  
  static async logoutUser(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ status: 401, message: 'No se proporcionó un token.' });
      }
  
      const token = authHeader.split(' ')[1];
  
      const user = await User.findOne({ where: { jwt_token: token } });
      if (!user) {
        return res.status(404).json({ status: 404, message: 'Usuario no encontrado.' });
      }
  
      user.jwt_token = null; // Invalidamos el token almacenado
      await user.save();
  
      return res.status(200).json({ status: 200, message: 'Sesión cerrada correctamente.' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return res.status(500).json({ status: 500, message: 'Error al cerrar sesión.', error: error.message });
    }
  }  
  }
