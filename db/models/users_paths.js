'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_paths = sequelize.define('users_paths', {
    id_user: DataTypes.INTEGER,
    id_path: DataTypes.INTEGER,
    pathName: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    paranoid: true    
  });
  users_paths.associate = function(models) {
    users_paths.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    users_paths.belongsTo(models.paths, {
      foreignKey:"id_path",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  users_paths.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return users_paths;
};
