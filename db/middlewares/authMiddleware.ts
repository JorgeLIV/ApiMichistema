import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (requiredRole?: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      return res.status(403).json({ message: 'No se proporcionó un token.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (!decoded || !decoded.id) {
        return res.status(400).json({ message: 'Token no contiene información de usuario válida.' });
      }
      req.user = decoded;
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: 'Acceso denegado, rol insuficiente.' });
      }
      next(); 
    } catch (error) {
      console.error('Error al verificar el token:', error);
      return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
  };
};
