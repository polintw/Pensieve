'use strict';
module.exports = (sequelize, DataTypes) => {
  const lastUpdate_nodeBelongs = sequelize.define('lastUpdate_nodeBelongs', {
    id_node: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER,
    item: DataTypes.STRING,
    increase: DataTypes.BOOLEAN
  }, {});
  lastUpdate_nodeBelongs.associate = function(models) {
    lastUpdate_nodeBelongs.belongsTo(models.nouns, {
      foreignKey:"id_node",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    lastUpdate_nodeBelongs.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };

  lastUpdate_nodeBelongs.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return lastUpdate_nodeBelongs;
};
