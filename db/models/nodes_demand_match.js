'use strict';
module.exports = (sequelize, DataTypes) => {
  const nodes_demand_match = sequelize.define('nodes_demand_match', {
    id_node: DataTypes.INTEGER,
    locked: DataTypes.BOOLEAN,
    finished: DataTypes.INTEGER,
    supply: DataTypes.BOOLEAN,
    lockedAt: DataTypes.DATE,
    list_demand: DataTypes.STRING,
    list_willing: DataTypes.STRING,
    list_taking: DataTypes.STRING,
    list_waiting: DataTypes.STRING
  }, {});
  nodes_demand_match.associate = function(models) {
    nodes_demand_match.belongsTo(models.nouns, {
      foreignKey:"id_node",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  nodes_demand_match.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return nodes_demand_match;
};
