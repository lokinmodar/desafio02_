import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
// para testar a conexão, importar User. Essa rotina deverá ficar nos Controllers posteriormente
// import User from './app/models/User';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // como está definido aqui, somente rotas que estiverem abaixo dele no código irá usar esse middleware

routes.put('/users', UserController.update);

/*
routes.get('/', async (req, res) => {
 const user = await User.create({
    name: 'Qrevv Quequé',
    email: 'qrevv@cacotinha.com',
    password_hash: '123456789',
  });

  return res.json(user);
});

*/
// removendo a função anteriormente criada apenas para teste
// função acima definida como async para que possamos usar await em operações que dependem do BD

export default routes;
