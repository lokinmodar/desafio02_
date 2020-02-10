import Sequelize, { Model } from 'sequelize';

import cep from 'cep-promise'; // rotina para pesquisa do endereço pelo CEP

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        // colunas modificáveis pelo usuário
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        cep: Sequelize.STRING,
        number: Sequelize.STRING,
        complement: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        street: Sequelize.STRING,
        neighborhood: Sequelize.STRING,
      },
      {
        // configurações adicionais do sequelize
        sequelize,
      }
    );
    // adicionando um Hook do Sequelize para geração do hash ANTES do salvamento no BD
    this.addHook('beforeSave', async recipient => {
      // assíncrono
      if (recipient.cep) {
        const address = await cep(recipient.cep);

        recipient.state = address.state;
        recipient.city = address.city;
        recipient.street = address.street;
        recipient.neighborhood = address.neighborhood;
      }
    });
    return this;
  }
}

export default Recipient;
