'use strict';
module.exports = (sequelize, DataTypes) => {
  const verifications = sequelize.define('verifications', {
    id_user: DataTypes.INTEGER,
    password: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});

  verifications.associate = function(models) {
    verifications.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  };
  return verifications;
};
