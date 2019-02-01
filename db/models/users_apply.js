'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_apply = sequelize.define('users_apply', {
    id_user: DataTypes.INTEGER,
    status: DataTypes.STRING,
    token_email: DataTypes.STRING,
    createdAt: DataTypes.DATE
  }, {
    charset: 'utf8mb4' //for Mandarin, or emoji if you don't speak in mandarin
  });
  users_apply.associate = function(models) {
    users_apply.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  };
  return users_apply;
};
