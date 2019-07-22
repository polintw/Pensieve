'use strict';
module.exports = (sequelize, DataTypes) => {
  const lastvisit_index = sequelize.define('lastvisit_index', {
    id_user: DataTypes.INTEGER(10),
    ip: DataTypes.TEXT('tiny')
  }, {});
  lastvisit_index.associate = function(models) {
    lastvisit_index.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  lastvisit_index.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return lastvisit_index;
};
