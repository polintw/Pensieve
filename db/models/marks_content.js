'use strict';
module.exports = (sequelize, DataTypes) => {
  const marks_content = sequelize.define('marks_content', {
    id_mark: DataTypes.INTEGER,
    id_unit: DataTypes.INTEGER,
    contentstate_noText: DataTypes.STRING,
    text_byBlocks: DataTypes.STRING
  }, {
    charset: 'utf8mb4', //for Mandarin, or emoji if you don't speak in mandarin
    paranoid: true
  });
  marks_content.associate = function(models) {
    // associations can be defined here
    marks_content.belongsTo(models.units, {
      foreignKey:"id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    marks_content.belongsTo(models.marks, {
      foreignKey:"id_mark",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  marks_content.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return marks_content;
};
