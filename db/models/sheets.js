'use strict';
module.exports = (sequelize, DataTypes) => {
  const sheets = sequelize.define('sheets', {
    id_user: DataTypes.INTEGER,
    gender: DataTypes.INTEGER,
    birthYear: DataTypes.STRING,
    birthMonth: DataTypes.STRING,
    birthDate: DataTypes.STRING,
    residence: DataTypes.STRING
  }, {
    charset: 'utf8mb4' //for Mandarin, or emoji if you don't speak in mandarin
  });
  sheets.associate = function(models) {
    users_apply.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  };
  return sheets;
};
