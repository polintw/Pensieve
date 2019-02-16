'use strict';
module.exports = (sequelize, DataTypes) => {
  const inspired = sequelize.define('inspired', {
    id_mark: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER
  }, {});
  inspired.associate = function(models) {
    inspired.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    inspired.belongsTo(models.marks, {
      foreignKey:"id_mark",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  return inspired;
};
