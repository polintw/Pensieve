'use strict';
module.exports = (sequelize, DataTypes) => {
  const units_paths_subdistribute = sequelize.define('units_paths_subdistribute', {
    id_unit: DataTypes.UUID,
    id_path: DataTypes.INTEGER,
    id_subPath: DataTypes.INTEGER,
    serial_subPath: DataTypes.INTEGER
  }, {});
  units_paths_subdistribute.associate = function(models) {
    units_paths_subdistribute.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units_paths_subdistribute.belongsTo(models.paths, {
      foreignKey:"id_path",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units_paths_subdistribute.belongsTo(models.paths_subcate, {
      foreignKey:"id_subPath",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  units_paths_subdistribute.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return units_paths_subdistribute;
};
