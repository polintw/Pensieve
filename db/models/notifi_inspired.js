'use strict';
module.exports = (sequelize, DataTypes) => {
  const notifi_inspired = sequelize.define('notifi_inspired', {
    id_mark: DataTypes.INTEGER(10),
    id_unit: DataTypes.INTEGER(10),
    status: DataTypes.TEXT('tiny')
  }, {});
  notifi_inspired.associate = function(models) {
    notifi_inspired.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    notifi_inspired.belongsTo(models.marks, {
      foreignKey:"id_mark",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  return notifi_inspired;
};
