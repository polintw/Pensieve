'use strict';
module.exports = (sequelize, DataTypes) => {
  const units_stat_interact = sequelize.define('units_stat_interact', {
    id_unit: DataTypes.UUID,
    times_unsignedLoad: DataTypes.INTEGER
  }, {});
  units_stat_interact.associate = function(models) {
    units_stat_interact.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  units_stat_interact.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return units_stat_interact;
};
