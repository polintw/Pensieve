'use strict';
module.exports = (sequelize, DataTypes) => {
  const units = sequelize.define('units', {
    id: DataTypes.INTEGER,
    id_author: DataTypes.INTEGER,
    url_pic_layer0: DataTypes.STRING,
    url_pic_layer1: DataTypes.STRING,
    id_primer: DataTypes.INTEGER,
    established: DataTypes.DATE
  }, {});
  units.associate = function(models) {
    // associations can be defined here
  };
  return units;
};