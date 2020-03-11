'use strict';
module.exports = (sequelize, DataTypes) => {
  const marks_content = sequelize.define('marks_content', {
    id_mark: DataTypes.INTEGER,
    id_unit: DataTypes.UUID,
    contentEntityMap: DataTypes.STRING,
    contentBlocks_Light: DataTypes.STRING,
    text_byBlocks: DataTypes.STRING,
    inlineStyleRanges_byBlocks: DataTypes.STRING,
    entityRanges_byBlocks: DataTypes.STRING,
    data_byBlocks: DataTypes.STRING
  }, {
    charset: 'utf8mb4', //for Mandarin, or emoji if you don't speak in mandarin
    paranoid: true //set it to 'true' could let the Sequelize know locaaly,
    //it should ignore any column which is not 'null' in 'deletedAt' (so called 'soft delete')
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
