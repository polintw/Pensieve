'use strict';
module.exports = (sequelize, DataTypes) => {
  const units_author = sequelize.define('units_author', {
    id_unit: DataTypes.INTEGER,
    id_author: DataTypes.INTEGER,
    reach: DataTypes.INTEGER,
    broaded: DataTypes.INTEGER
  }, {paranoid: true});

  units_author.associate = function(models) {
    units_author.belongsTo(models.users, {
      foreignKey:"id_author",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units_author.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };

  units_author.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return units_author;
};
