'use strict';
module.exports = (sequelize, DataTypes) => {
  const notifications = sequelize.define('notifications', {
    id_reciever: DataTypes.INTEGER(10),
    id_user: DataTypes.INTEGER(10),
    id_unit: DataTypes.INTEGER(10),
    type: DataTypes.INTEGER(4),
    status: DataTypes.TEXT('tiny')
  }, {});
  notifications.associate = function(models) {
    notifications.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    notifications.belongsTo(models.users, {
      foreignKey:"id_reciever",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    notifications.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };

  return notifications;
};
