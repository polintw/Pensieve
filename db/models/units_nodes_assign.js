'use strict';
module.exports = (sequelize, DataTypes) => {
  const units_nodes_assign = sequelize.define('units_nodes_assign', {
    id_unit: DataTypes.UUID,
    id_author: DataTypes.INTEGER,
    nodeAssigned: DataTypes.INTEGER,
    belongTypes: DataTypes.STRING
  }, {});
  units_nodes_assign.associate = function(models) {
    // associations can be defined here
    units_nodes_assign.belongsTo(models.users, {
      foreignKey:"id_author",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units_nodes_assign.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units_nodes_assign.belongsTo(models.nouns, {
      foreignKey:"nodeAssigned",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  units_nodes_assign.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return units_nodes_assign;
};
