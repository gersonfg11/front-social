import { Router, Response, NextFunction } from 'express';
import { AppDataSource } from '../../shared/database/dataSource';
import { Post } from './post.entity';
import { Like } from './like.entity';
import { User } from '../users/user.entity';
import { authMiddleware, AuthRequest } from '../../shared/middleware/authMiddleware';
import { AppError } from '../../shared/middleware/errorHandler';

export const postsRouter = Router();

/**
 * @openapi
 * /api/posts:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Lista publicaciones de otros usuarios.
 *     responses:
 *       200:
 *         description: Lista de publicaciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   message:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   userAlias:
 *                     type: string
 *                   likesCount:
 *                     type: number
 */
postsRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const postRepo = AppDataSource.getRepository(Post);

    const posts = await postRepo.find({ relations: ['user', 'likes'], order: { createdAt: 'DESC' } });

    const result = posts.map((post) => ({
      id: post.id,
      message: post.message,
      createdAt: post.createdAt,
      userAlias: post.user.alias,
      userId: post.user.id,
      likesCount: post.likes ? post.likes.length : 0
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/posts:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Crea una nueva publicacin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Publicacin creada.
 *       400:
 *         description: Datos invalidos.
 */
postsRouter.post('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { message } = req.body;

    if (!message) {
      throw new AppError('El mensaje es obligatorio', 400);
    }

    if (!req.userId) {
      throw new AppError('Usuario no autenticado', 401);
    }

    const userRepo = AppDataSource.getRepository(User);
    const postRepo = AppDataSource.getRepository(Post);

    const user = await userRepo.findOne({ where: { id: req.userId } });

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    const post = postRepo.create({ message, user });
    await postRepo.save(post);

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/posts/{id}/like:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Enva un like a una publicacin.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Like registrado.
 *       400:
 *         description: Ya existe un like de este usuario.
 *       404:
 *         description: Publicacin no encontrada.
 */
postsRouter.post('/:id/like', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const postId = Number(req.params.id);

    if (!req.userId) {
      throw new AppError('Usuario no autenticado', 401);
    }

    const postRepo = AppDataSource.getRepository(Post);
    const likeRepo = AppDataSource.getRepository(Like);
    const userRepo = AppDataSource.getRepository(User);

    const post = await postRepo.findOne({ where: { id: postId }, relations: ['likes'] });

    if (!post) {
      throw new AppError('Publicacin no encontrada', 404);
    }

    const user = await userRepo.findOne({ where: { id: req.userId } });

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    const existingLike = await likeRepo.findOne({ where: { post: { id: postId }, user: { id: req.userId } } });

    if (existingLike) {
      throw new AppError('Ya has dado like a esta publicacin', 400);
    }

    const like = likeRepo.create({ post, user });
    await likeRepo.save(like);

    res.json({ message: 'Like registrado' });
  } catch (err) {
    next(err);
  }
});

postsRouter.put('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!req.userId) {
      throw new AppError('Usuario no autenticado', 401);
    }

    if (!message || !message.trim()) {
      throw new AppError('El mensaje es obligatorio', 400);
    }

    const postRepo = AppDataSource.getRepository(Post);

    const post = await postRepo.findOne({ where: { id: Number(id) }, relations: ['user'] });

    if (!post) {
      throw new AppError('Publicación no encontrada', 404);
    }

    if (post.user.id !== req.userId) {
      throw new AppError('No tienes permiso para editar esta publicación', 403);
    }

    post.message = message;
    await postRepo.save(post);

    res.json({ message: 'Publicación actualizada' });
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/posts/{id}:
 *   delete:
 *     tags:
 *       - Posts
 *     summary: Elimina una publicacin propia.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Publicacin eliminada.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: No tienes permiso para eliminar esta publicacin.
 *       404:
 *         description: Publicacin no encontrada.
 */
postsRouter.delete(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.userId;

      if (!userId) {
        throw new AppError('No autorizado', 401);
      }

      const postRepo = AppDataSource.getRepository(Post);
      const post = await postRepo.findOne({
        where: { id: Number(id) },
        relations: ['user']
      });

      if (!post) {
        throw new AppError('Publicación no encontrada', 404);
      }

      if (post.user.id !== userId) {
        throw new AppError('No tienes permiso para eliminar esta publicación', 403);
      }

      await postRepo.remove(post);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);
