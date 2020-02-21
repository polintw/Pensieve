'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_nodes_homeland = sequelize.define('users_nodes_homeland', {
    id_user: DataTypes.INTEGER,
    id_node: DataTypes.INTEGER,
    historyify: DataTypes.BOOLEAN
  }, {});
  users_nodes_homeland.associate = function(models) {
    users_nodes_homeland.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    users_nodes_homeland.belongsTo(models.nouns, {
      foreignKey:"id_node",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  users_nodes_homeland.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return users_nodes_homeland;
};
