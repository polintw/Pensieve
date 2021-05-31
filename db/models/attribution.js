'use strict';
module.exports = (sequelize, DataTypes) => {
  const attribution = sequelize.define('attribution', {
    id_noun: DataTypes.INTEGER,
    id_unit: DataTypes.UUID,
    id_author: DataTypes.INTEGER,
    author_identity: DataTypes.STRING,
    used_authorId: DataTypes.INTEGER,
  }, {
    paranoid: true //set it to 'true' could let the Sequelize know locaaly,
    //it should ignore any column which is not 'null' in 'deletedAt' (so called 'soft delete')
  });
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
    attribution.hasMany(models.inspireds, { // this is not a 'key pair', just tell th Sequelize to 'associate' 2 tbs
      foreignKey:"id_unit",
      sourceKey: "id_unit",
    });
  };
  attribution.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return attribution;
};
