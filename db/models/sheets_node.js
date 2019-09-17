'use strict';
module.exports = (sequelize, DataTypes) => {
  const sheets_node = sequelize.define('sheets_node', {
    id_user: DataTypes.INTEGER,
    residence: DataTypes.INTEGER,
    residence_history: DataTypes.INTEGER,
    hometown: DataTypes.INTEGER,
    stay: DataTypes.INTEGER,
    stay_history: DataTypes.INTEGER
  }, {
    charset: 'utf8mb4', //for Mandarin, or emoji if you don't speak in mandarin
  });
  sheets_node.associate = function(models) {
    // associations can be defined here
    sheets_node.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  sheets_node.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return sheets_node;
};
