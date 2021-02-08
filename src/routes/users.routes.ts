import { Router } from 'express';
import multer from 'multer';

import CreateUserService from '../services/CreateUserService';
import UpdateUserService from '../services/UpdateUserAvatar';
import ensureAuthenticate from '../middlewares/ensureAuthenticate';
import uploadConfig from '../config/uploads';

const usersRoutes = Router();

const upload = multer(uploadConfig);

/**
 * Vejamos que até agora já trabalhamos com os seguinte
 * conceitos:
 * Repositories
 *
 * Services => Se não houver regra de negócio alguma, podemos
 * utilizar só o Repositório
 */

usersRoutes.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

/**
 * Usar o patch quando queremos atualizar uma única
 * informação do usuário, quando for mais infos devemos
 * usar o método put.
 */

usersRoutes.patch(
  '/avatar',
  ensureAuthenticate,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserService();

    const user = await updateUserAvatar.execute({
      userId: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRoutes;
