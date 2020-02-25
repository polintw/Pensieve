'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_nodes_residence = sequelize.define('users_nodes_residence', {
    id_user: DataTypes.INTEGER,
    id_node: DataTypes.INTEGER,
    historyify: DataTypes.BOOLEAN
  }, {});
  users_nodes_residence.associate = function(models) {
    users_nodes_residence.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    users_nodes_residence.belongsTo(models.nouns, {
      foreignKey:"id_node",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  users_nodes_residence.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return users_nodes_residence;
};
