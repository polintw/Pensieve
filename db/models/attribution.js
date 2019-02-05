'use strict';
module.exports = (sequelize, DataTypes) => {
console.log('here, in models/attribution')

  const attribution = sequelize.define('attribution', {
    id_noun: DataTypes.INTEGER,
    id_unit: DataTypes.INTEGER,
    id_author: DataTypes.INTEGER,
    established: DataTypes.DATE
  }, {
    paranoid: true
  });
console.log('here, in models/attribution, after const')
  attribution.associate = function(models) {
    attribution.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    attribution.belongsTo(models.nouns, {
      foreignKey:"id_noun",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
console.log('here, in models/attribution, before return')
  return attribution;
};
