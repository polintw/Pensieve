'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_custom_index = sequelize.define('users_custom_index', {
    id_user: DataTypes.INTEGER,
    last_visit: DataTypes.DATE,
    last_feedGroup: DataTypes.INTEGER,
    last_focusbelong: DataTypes.STRING,
    currentbelong: DataTypes.STRING
  }, {});
  users_custom_index.associate = function(models) {
    users_custom_index.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  users_custom_index.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return users_custom_index;
};
