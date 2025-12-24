import 'reflect-metadata';
import dotenv from 'dotenv';
import { AppDataSource, createConnection } from '../shared/database/dataSource';
import { User } from '../modules/users/user.entity';
import { Post } from '../modules/posts/post.entity';
import { Like } from '../modules/posts/like.entity';
import { hashPassword } from '../modules/auth/passwordUtils';

dotenv.config();

const run = async () => {
  await createConnection();

  const userRepo = AppDataSource.getRepository(User);
  const postRepo = AppDataSource.getRepository(Post);
  const likeRepo = AppDataSource.getRepository(Like);

  await AppDataSource.createQueryBuilder().delete().from(Like).execute();
  await AppDataSource.createQueryBuilder().delete().from(Post).execute();
  await AppDataSource.createQueryBuilder().delete().from(User).execute();

  const usersData = [
    {
      firstName: 'Juan',
      lastName: 'Parez',
      email: 'juan@example.com',
      birthDate: new Date('1990-01-01'),
      alias: 'juanp'
    },
    {
      firstName: 'Mara',
      lastName: 'Gomez',
      email: 'maria@example.com',
      birthDate: new Date('1992-05-10'),
      alias: 'mariag'
    },
    {
      firstName: 'Luis',
      lastName: 'Ramarez',
      email: 'luis@example.com',
      birthDate: new Date('1988-11-20'),
      alias: 'luisr'
    }
  ];

  for (const data of usersData) {
    const passwordHash = await hashPassword('123456');

    const user = userRepo.create({
      ...data,
      passwordHash
    });

    await userRepo.save(user);

    const post = postRepo.create({
      message: `Hola, soy ${data.firstName}`,
      user
    });

    await postRepo.save(post);
  }

  console.log('Seed de usuarios y publicaciones completado');

  process.exit(0);
};

run().catch((err) => {
  console.error('Error ejecutando seed', err);
  process.exit(1);
});
