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
    users_apply.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    users_apply.belongsTo(models.nouns, {
      foreignKey:"id_noun",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  return attribution;
};
