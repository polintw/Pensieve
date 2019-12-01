'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_prefer_nodes = sequelize.define('users_prefer_nodes', {
    id_user: DataTypes.INTEGER,
    list_shared: DataTypes.STRING,
    list_inspired: DataTypes.STRING,
    list_recent20: DataTypes.STRING
  }, {});
  users_prefer_nodes.associate = function(models) {
    users_prefer_nodes.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  users_prefer_nodes.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return users_prefer_nodes;
};
