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
    users.hasMany(models.attribution, {
      foreignKey:"id_noun",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  return nouns;
};
