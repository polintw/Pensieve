'use strict';
module.exports = (sequelize, DataTypes) => {
  const daily = sequelize.define('daily', {
    day: DataTypes.DATE,
    focus_node: DataTypes.INTEGER
  }, {});
  daily.associate = function(models) {
    daily.belongsTo(models.nouns, {
      foreignKey:"focus_node",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  daily.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return daily;
};
