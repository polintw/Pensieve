'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class list_mails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      list_mails.belongsTo(models.users, {
        foreignKey:"id_user",
        targetKey: "id",
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
    }
  };
  list_mails.init({
    id_user: DataTypes.INTEGER(10),
    setting: DataTypes.STRING(),
    last_deliver: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'list_mails',
  });
  list_mails.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return list_mails;
};
