import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    // validações do Schema
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    // como um Middleware
    const userExists = await User.findOne({ where: { email: req.body.email } });
    // acima: pegando o e-mail do novo usuário a cadastrar

    if (userExists) {
      // checando se um usuário com o email cadastrado já existe
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email, provider } = await User.create(req.body); // passados os atributos no corpo da requisição em JSON

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6) // when permite adicionar condições de existência de campos no schema
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    // checando se o email novo já existe na base
    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      // acima: pegando o e-mail novo a ser atualizado
      if (userExists) {
        // checando se um usuário com o email cadastrado já existe
        return res.status(400).json({ error: 'E-mail already in use.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      // checando se a senha informada está correta
      return res.status(401).json({ error: 'Incorrect old password.' });
    }

    const { id, name, provider } = await user.update(req.body);

    // console.log(req.userId);

    return res.json({
      updated: {
        id,
        name,
        email,
        provider,
      },
    });
  }
}

export default new UserController();
