'use strict';
module.exports = (sequelize, DataTypes) => {
  const attribution = sequelize.define('attribution', {
    id_noun: DataTypes.INTEGER,
    id_unit: DataTypes.INTEGER,
    id_author: DataTypes.INTEGER,
    established: DataTypes.DATE
  }, {
    paranoid: true
  });
  attribution.associate = function(models) {
    // associations can be defined here
  };
  return attribution;
};
