'use strict';
module.exports = (sequelize, DataTypes) => {
  const inspireds = sequelize.define('inspireds', {
    id_unit: DataTypes.UUID,
    id_user: DataTypes.INTEGER,
  }, {
    paranoid: true
  });
  inspireds.associate = function(models) {
    inspireds.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    inspireds.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  inspireds.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return inspireds;
};
