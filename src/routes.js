import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
// para testar a conexão, importar User. Essa rotina deverá ficar nos Controllers posteriormente
// import User from './app/models/User';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // como está definido aqui, somente rotas que estiverem abaixo dele no código irá usar esse middleware

routes.post('/recipients', RecipientController.store);
routes.put('/users', UserController.update);
routes.put('/recipients', RecipientController.update);

export default routes;
