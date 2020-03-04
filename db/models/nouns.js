'use strict';
module.exports = (sequelize, DataTypes) => {

  const nouns = sequelize.define('nouns', {
    name: DataTypes.STRING,
    prefix: DataTypes.STRING,
    category: DataTypes.STRING,
    language: DataTypes.TEXT('tiny'),
    parent: DataTypes.BOOLEAN,
    child: DataTypes.BOOLEAN
  }, {
    charset: 'utf8mb4', //for Mandarin, or emoji if you don't speak in mandarin
  });
  nouns.associate = function(models) {
    nouns.hasOne(models.lastUpdate_nodeBelongs, {
      foreignKey:"id_node",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    nouns.hasMany(models.attribution, {
      foreignKey:"id_noun",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    nouns.hasMany(models.nodes_activity, {
      foreignKey:"id_node",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    nouns.hasMany(models.users_nodes_homeland, {
      foreignKey:"id_node",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    nouns.hasMany(models.users_nodes_residence, {
      foreignKey:"id_node",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units.hasMany(models.units_nodes_assign, {
      foreignKey:"nodeAssigned",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  return nouns;
};
