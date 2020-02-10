// este arquivo cria a conexão com o banco postgres
// este arquivo carrega os models da aplicação
import Sequelize from 'sequelize';

import databaseConfig from '../config/database'; // configurações da base de dados

// importando os Models
import User from '../app/models/User';
import Recipient from '../app/models/Recipient';

// Criando um Array com todos os models da aplicação
const models = [User, Recipient];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // gera a conexão com o BD.
    // É a variável que é esperada dentro dos models dentro do método 'init'

    // Depois da conexão com o banco de dados, percorrer o array de models
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
