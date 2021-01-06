'use strict';
module.exports = (sequelize, DataTypes) => {
  const units_req_origin = sequelize.define('units_req_origin', {
    id_unit: DataTypes.UUID,
    exposedId: DataTypes.UUID,
    prev_domain: DataTypes.STRING,
    reqCount: DataTypes.INTEGER
  }, {});
  units_req_origin.associate = function(models) {
    // associations can be defined here
    units_req_origin.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  units_req_origin.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return units_req_origin;
};
