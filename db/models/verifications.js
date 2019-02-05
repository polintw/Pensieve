'use strict';
module.exports = (sequelize, DataTypes) => {
console.log('here, in models/verifications')
  const verifications = sequelize.define('verifications', {
    id_user: DataTypes.INTEGER,
    password: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
console.log('here, in models/verifications, after const')

  verifications.associate = function(models) {
    verifications.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  };
console.log('here, in models/verifications, before return')
  return verifications;
};
