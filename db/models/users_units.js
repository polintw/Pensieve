'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_units = sequelize.define('users_units', {
    id_unit: DataTypes.UUID,
    id_user: DataTypes.INTEGER,
    count: DataTypes.INTEGER,
    lastTime: DataTypes.DATE,
    timeDistance: DataTypes.STRING
  }, {});
  users_units.associate = function(models) {
    users_units.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    users_units.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  users_units.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return users_units;
};
