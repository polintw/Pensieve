'use strict';
module.exports = (sequelize, DataTypes) => {
  //don't define 'id', or others(ex. createdAt) would used by sequelize here
  // would produce error
  const nouns = sequelize.define('nouns', {
    name: DataTypes.STRING,
    prefix: DataTypes.STRING,
    category: DataTypes.STRING,
    language: DataTypes.TEXT('tiny'),
    parent: DataTypes.BOOLEAN,
    child: DataTypes.BOOLEAN,
    parent_id: DataTypes.INTEGER,
    prefix_correspond_id: DataTypes.INTEGER,
  }, {
    charset: 'utf8mb4', //for Mandarin, or emoji if you don't speak in mandarin
  });
  nouns.associate = function(models) {
    nouns.hasOne(models.lastUpdate_nodeBelongs, {
      foreignKey:"id_node",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    nouns.hasOne(models.nodes_locationAdmin, {
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
    nouns.hasMany(models.units_nodes_assign, {
      foreignKey:"nodeAssigned",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    nouns.hasMany(models.belongs_invitation, {
      foreignKey:"id_node",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    // foreignKey to 'table self'
    nouns.belongsTo(models.nouns, {
      as: 'nouns2', //because this is a self associated, this line, is setting a clear assciation to alias when INNER JOIN
      foreignKey:"parent_id",
      targetKey: "id",
      onDelete: 'set null',
      onUpdate: 'cascade'
    });
    nouns.hasMany(models.nouns, {
      foreignKey:"parent_id",
      sourceKey: "id",
      onDelete: 'set null',
      onUpdate: 'cascade'
    });
  };
  return nouns;
};
