import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { createConnection } from './shared/database/dataSource';
import { errorHandler } from './shared/middleware/errorHandler';
import { authRouter } from './modules/auth/auth.routes';
import { postsRouter } from './modules/posts/posts.routes';
import { usersRouter } from './modules/users/users.routes';
import { swaggerSpec } from './shared/swagger/swaggerSpec';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

createConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar con la base de datos', err);
    process.exit(1);
  });

export { app };
