import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    // validações do Schema
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      cep: Yup.string()
        .required()
        .min(8),
      number: Yup.string(),
      complement: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const {
      id,
      name,
      email,
      street,
      number,
      complement,
      neighborhood,
      state,
      cep,
    } = await Recipient.create(req.body); // passados os atributos no corpo da requisição em JSON

    return res.json({
      id,
      name,
      email,
      street,
      number,
      complement,
      neighborhood,
      state,
      cep,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
      name: Yup.string(),
      email: Yup.string().email(),
      cep: Yup.string()
        .required()
        .min(8),
      number: Yup.string(),
      complement: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { id } = req.body;

    const recipient = await Recipient.findByPk(id);

    // checando se o recipient já existe na base
    if (id === recipient.id) {
      const recipientExists = await Recipient.findOne({ where: { id } });
      // acima: pegando o recipient a ser atualizado
      if (!recipientExists) {
        // se recipíent não existe
        return res.status(400).json({ error: 'Recipient not found!' });
      }
    }

    const {
      name,
      email,
      street,
      number,
      complement,
      neighborhood,
      state,
      cep,
    } = await recipient.update(req.body);

    // console.log(req.userId);

    return res.json({
      id,
      updated: {
        name,
        email,
        street,
        number,
        complement,
        neighborhood,
        state,
        cep,
      },
    });
  }
}

export default new RecipientController();
