'use strict';
module.exports = (sequelize, DataTypes) => {
  const units_paths_subdis_sign = sequelize.define('units_paths_subdis_sign', {
    id_unit: DataTypes.UUID,
    id_path: DataTypes.INTEGER,
    id_subPath: DataTypes.INTEGER,
    used_userId: DataTypes.INTEGER,
    userId_Identity: DataTypes.STRING
  }, {});
  units_paths_subdis_sign.associate = function(models) {
    units_paths_subdis_sign.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units_paths_subdis_sign.belongsTo(models.paths, {
      foreignKey:"id_path",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units_paths_subdis_sign.belongsTo(models.paths_subcate, {
      foreignKey:"id_subPath",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  units_paths_subdis_sign.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return units_paths_subdis_sign;
};
