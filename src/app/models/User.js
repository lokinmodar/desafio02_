import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs'; // rotinas de criptografia

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        // colunas modificáveis pelo usuário
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // campo não-refletido na tabela do BD
        password_hash: Sequelize.STRING,
      },
      {
        // configurações adicionais do sequelize
        sequelize,
      }
    );
    // adicionando um Hook do Sequelize para geração do hash ANTES do salvamento no BD
    this.addHook('beforeSave', async user => {
      // assíncrono
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
        // geração do hash de senha - usando força 8 (n de rounds)
      }
    });
    return this;
  }

  checkPassword(password) {
    // compara informação inserida na senha de login com hash do cadastro
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
