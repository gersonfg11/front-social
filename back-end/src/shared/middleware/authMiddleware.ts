import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AppError('Token no proporcionado', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key';
    const decoded = jwt.verify(token, secret) as { userId: number };
    req.userId = decoded.userId;
    return next();
  } catch {
    throw new AppError('Token inválido o expirado', 401);
  }
};
