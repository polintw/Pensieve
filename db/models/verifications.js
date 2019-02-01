'use strict';
module.exports = (sequelize, DataTypes) => {
  const verifications = sequelize.define('verifications', {
    id_user: DataTypes.INTEGER,
    password: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  verifications.associate = function(models) {
    // associations can be defined here
  };
  return verifications;
};