'use strict';
module.exports = (sequelize, DataTypes) => {
  const nodes_activity = sequelize.define('nodes_activity', {
    id_node: DataTypes.INTEGER(10),
    id_firstUnit: DataTypes.UUID,
    status: DataTypes.TEXT('tiny')
  }, {});
  nodes_activity.associate = function(models) {
    nodes_activity.belongsTo(models.nouns, {
      foreignKey:"id_node",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    nodes_activity.belongsTo(models.units, {
      foreignKey:"id_firstUnit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  nodes_activity.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return nodes_activity;
};
