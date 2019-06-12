'use strict';
module.exports = (sequelize, DataTypes) => {
  const inspired = sequelize.define('inspired', {
    id_mark: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER,
    createdAt: DataTypes.DATE //notice! this line is neccessary cuase we would select it as a params
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
  inspired.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return inspired;
};
