'use strict';
module.exports = (sequelize, DataTypes) => {
  const marks = sequelize.define('marks', {
    id: DataTypes.INTEGER,
    id_author: DataTypes.INTEGER,
    id_unit: DataTypes.INTEGER,
    layer: DataTypes.INTEGER,
    portion_top: DataTypes.FLOAT,
    portion_left: DataTypes.FLOAT,
    editor_content: DataTypes.STRING,
    serial: DataTypes.INTEGER,
    created: DataTypes.DATE
  }, {
    charset: 'utf8mb4', //for Mandarin, or emoji if you don't speak in mandarin
    paranoid: true
  });
  marks.associate = function(models) {
    users_apply.belongsTo(models.users, {
      foreignKey:"id_author",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    users_apply.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  return marks;
};
