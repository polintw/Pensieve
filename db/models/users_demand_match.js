'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_demand_match = sequelize.define('users_demand_match', {
    id_user: DataTypes.INTEGER,
    occupied: DataTypes.BOOLEAN,
    taking: DataTypes.STRING,
    list_wished: DataTypes.STRING,
    list_willing: DataTypes.STRING,
    list_waited: DataTypes.STRING
  }, {});
  users_demand_match.associate = function(models) {
    users_demand_match.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  users_demand_match.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return users_demand_match;
};
