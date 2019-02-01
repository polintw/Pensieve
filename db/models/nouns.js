'use strict';
module.exports = (sequelize, DataTypes) => {
  const nouns = sequelize.define('nouns', {
    id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    established: DataTypes.DATE
  }, {
    charset: 'utf8mb4', //for Mandarin, or emoji if you don't speak in mandarin
  });
  nouns.associate = function(models) {
    // associations can be defined here
  };
  return nouns;
};
