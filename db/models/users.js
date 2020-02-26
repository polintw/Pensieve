'use strict';
module.exports = (sequelize, DataTypes) => {
  //don't define 'id', or others(ex. createdAt) would used by sequelize here
  // would produce error
  const users = sequelize.define('users', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    account: DataTypes.STRING,
    email: DataTypes.STRING,
    status: DataTypes.TEXT('tiny'),
  }, {
    charset: 'utf8mb4' //for Mandarin, or emoji if you don't speak in mandarin
  });
  users.associate = function(models) {
    users.hasOne(models.users_apply, {
      foreignKey:"id_user",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    users.hasOne(models.verifications, {
      foreignKey:"id_user",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    users.hasOne(models.sheets, {
      foreignKey:"id_user",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    users.hasOne(models.lastvisit_notify, {
      foreignKey: "id_user",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    users.hasOne(models.lastvisit_shared, {
      foreignKey: "id_user",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    users.hasMany(models.users_nodes_homeland, {
      foreignKey:"id_user",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    users.hasMany(models.users_nodes_residence, {
      foreignKey:"id_user",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    users.hasMany(models.lastUpdate_nodeBelongs, {
      foreignKey:"id_user",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  return users;
};
