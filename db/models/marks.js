'use strict';
module.exports = (sequelize, DataTypes) => {
console.log('here, in models/marks')

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
  }).catch((err)=> console.log(err));
console.log('here, in models/marks, after const mark')

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
  };
console.log('here, in models/marks, before return')
  return marks;
};
