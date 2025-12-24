import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../shared/database/dataSource';
import { User } from '../users/user.entity';
import { AppError } from '../../shared/middleware/errorHandler';
import { comparePassword, hashPassword } from './passwordUtils';
import { authMiddleware, AuthRequest } from '../../shared/middleware/authMiddleware';

export const authRouter = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Inicia sesin y devuelve un token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token generado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Datos de entrada invalidos.
 *       401:
 *         description: Credenciales invalidas.
 */
authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email y contrasea son obligatorios', 400);
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Usuario o contrasea incorrectos', 401);
    }

    const isValid = await comparePassword(password, user.passwordHash);

    if (!isValid) {
      throw new AppError('Usuario o contrasea incorrectos', 401);
    }

    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key';
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    next(err);
  }
});

authRouter.post(
  '/change-password',
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new AppError('La contraseña actual y la nueva son obligatorias', 400);
      }

      if (!req.userId) {
        throw new AppError('Usuario no autenticado', 401);
      }

      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { id: req.userId } });

      if (!user) {
        throw new AppError('Usuario no encontrado', 404);
      }

      const isValid = await comparePassword(currentPassword, user.passwordHash);

      if (!isValid) {
        throw new AppError('La contraseña actual es incorrecta', 400);
      }

      user.passwordHash = await hashPassword(newPassword);
      await userRepo.save(user);

      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (err) {
      next(err);
    }
  }
);
