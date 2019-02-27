'use strict';
module.exports = (sequelize, DataTypes) => {
  const notifications = sequelize.define('notifications', {
    id_user: DataTypes.INTEGER,
    category: DataTypes.STRING,
    status: DataTypes.INTEGER,
    id_forward: DataTypes.INTEGER
  }, {});
  notifications.associate = function(models) {
    notifications.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  return notifications;
};
