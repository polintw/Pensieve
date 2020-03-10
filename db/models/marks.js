'use strict';
module.exports = (sequelize, DataTypes) => {
  const marks = sequelize.define('marks', {
    id_author: DataTypes.INTEGER,
    id_unit: DataTypes.UUID,
    layer: DataTypes.INTEGER,
    portion_top: DataTypes.FLOAT,
    portion_left: DataTypes.FLOAT,
    serial: DataTypes.INTEGER
  }, {
    charset: 'utf8mb4', //for Mandarin, or emoji if you don't speak in mandarin
    paranoid: true
  });

  marks.associate = function(models) {
    marks.belongsTo(models.users, {
      foreignKey:"id_author",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    marks.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    marks.hasOne(models.marks_content, {
      foreignKey:"id_mark",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  return marks;
};
