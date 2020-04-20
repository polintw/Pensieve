'use strict';
module.exports = (sequelize, DataTypes) => {
  const responds = sequelize.define('responds', {
    id_unit: DataTypes.UUID,
    id_primer: DataTypes.UUID,
    id_author: DataTypes.INTEGER,
    primer_author: DataTypes.INTEGER,
    primer_createdAt: DataTypes.DATE
  }, {});
  responds.associate = function(models) {
    responds.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    responds.belongsTo(models.units, {
      foreignKey:"id_primer",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    responds.belongsTo(models.users, {
      foreignKey:"primer_author",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    responds.belongsTo(models.users, {
      foreignKey:"id_author",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  responds.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return responds;
};
