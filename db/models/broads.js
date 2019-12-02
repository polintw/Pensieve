'use strict';
module.exports = (sequelize, DataTypes) => {
  const broads = sequelize.define('broads', {
    id_user: DataTypes.INTEGER,
    id_unit: DataTypes.INTEGER
  }, {
    paranoid: true //set it to 'true' could let the Sequelize know locaaly,
    //it should ignore any column which is not 'null' in 'deletedAt' (so called 'soft delete')
  });
  broads.associate = function(models) {
    broads.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    broads.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  broads.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return broads;
};
