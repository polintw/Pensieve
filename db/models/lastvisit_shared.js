'use strict';
module.exports = (sequelize, DataTypes) => {
  const lastvisit_shared = sequelize.define('lastvisit_shared', {
    id_user: DataTypes.INTEGER(10),
    ip: DataTypes.TEXT('tiny')
  }, {});
  lastvisit_shared.associate = function(models) {
    lastvisit_shared.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  lastvisit_shared.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return lastvisit_shared;
};
