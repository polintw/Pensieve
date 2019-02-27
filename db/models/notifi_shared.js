'use strict';
module.exports = (sequelize, DataTypes) => {
  const notifi_shared = sequelize.define('notifi_shared', {
    id_unit: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER,
    id_user_related: DataTypes.INTEGER,
    type: DataTypes.TEXT,
    status: DataTypes.INTEGER
  }, {});
  notifi_shared.associate = function(models) {
    notifi_shared.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    notifi_shared.belongsTo(models.users, {
      foreignKey: "id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    notifi_shared.belongsTo(models.users, {
      foreignKey:"id_user_related",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  return notifi_shared;
};
