'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: DataTypes.INTEGER(10).UNSIGNED,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    account: DataTypes.STRING,
    email: DataTypes.STRING,
    status: DataTypes.TEXT('tiny'),
  }, {
    charset: 'utf8mb4' //for Mandarin, or emoji if you don't speak in mandarin
  });
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};
