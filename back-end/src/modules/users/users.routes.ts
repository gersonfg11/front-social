import { Router, Response, NextFunction } from 'express';
import { AppDataSource } from '../../shared/database/dataSource';
import { User } from './user.entity';
import { authMiddleware, AuthRequest } from '../../shared/middleware/authMiddleware';
import { AppError } from '../../shared/middleware/errorHandler';

export const usersRouter = Router();

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtiene el perfil del usuario autenticado.
 *     responses:
 *       200:
 *         description: Perfil del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 alias:
 *                   type: string
 *                 birthDate:
 *                   type: string
 *                   format: date-time
 *                 email:
 *                   type: string
 *       401:
 *         description: Usuario no autenticado.
 */
usersRouter.get('/me', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AppError('Usuario no autenticado', 401);
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: req.userId } });

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      alias: user.alias,
      birthDate: user.birthDate,
      email: user.email
    });
  } catch (err) {
    next(err);
  }
});
