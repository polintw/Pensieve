'use strict';
module.exports = (sequelize, DataTypes) => {
  const nodes_additional = sequelize.define('nodes_additional', {
    id_node: DataTypes.INTEGER(10),
    category: DataTypes.STRING,
    location_lat: DataTypes.DECIMAL(21, 16), // (precision, scale) to decimal point,
    location_lon: DataTypes.DECIMAL(21, 16), // (precision, scale) to decimal point
    osm_id: DataTypes.INTEGER,
    wiki_data_id: DataTypes.STRING(63),
    wiki_pedia_name: DataTypes.STRING(255)
  }, {});
  nodes_additional.associate = function(models) {
    // associations can be defined here
    nodes_additional.belongsTo(models.nouns, {
      foreignKey:"id_node",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  nodes_additional.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return nodes_additional;
};
