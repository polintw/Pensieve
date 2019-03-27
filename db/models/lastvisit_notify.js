'use strict';
module.exports = (sequelize, DataTypes) => {
  const lastvisit_notify = sequelize.define('lastvisit_notify', {
    id_user: DataTypes.INTEGER,
    ip: DataTypes.STRING
  }, {});
  lastvisit_notify.associate = function(models) {
    lastvisit_notify.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  inspired.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return lastvisit_notify;
};
