'use strict';
module.exports = (sequelize, DataTypes) => {

  const units = sequelize.define('units', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false //I'm not sure what the default value of autoIncrement for 'id'
    },
    exposedId:{
      type: DataTypes.UUID,
      defaultValue: function(){
        /*
        reference: https://cythilya.github.io/2017/03/12/uuid/
        */
        let d = Date.now(); //milliseconds, similat to date.getTime().
        return 'xxxxxxiyxxixxxiyxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
      },
      allowNull: false,
      unique: true
    },
    id_author: DataTypes.INTEGER,
    url_pic_layer0: DataTypes.STRING,
    url_pic_layer1: DataTypes.STRING,
    id_primer: DataTypes.INTEGER,
    author_identity: DataTypes.STRING,
    used_authorId: DataTypes.INTEGER,
    outboundLink_main: DataTypes.STRING,
    latitude_img: DataTypes.DECIMAL(21, 16), // (precision, scale) to decimal point
    longitude_img: DataTypes.DECIMAL(21, 16), // (precision, scale) to decimal point
    createdAt: DataTypes.DATE //notice! this line is neccessary cuase we would select it as a params
  }, {
    paranoid: true
  });
  units.associate = function(models) {
    units.hasMany(models.users_units, {
      foreignKey:"id_unit",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units.hasMany(models.marks, {
      foreignKey:"id_unit",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units.hasMany(models.marks_content, {
      foreignKey:"id_unit",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units.hasMany(models.attribution, {
      foreignKey:"id_unit",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units.hasMany(models.responds, {
      foreignKey:"id_unit",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units.hasMany(models.responds, {
      foreignKey:"id_primer",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units.hasMany(models.units_nodes_assign, {
      foreignKey:"id_unit",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units.hasMany(models.units_paths_subdistribute, {
      foreignKey:"id_unit",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units.hasMany(models.nodes_activity, {
      foreignKey:"id_firstUnit",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units.hasMany(models.inspireds, {
      foreignKey:"id_unit",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  return units;
};
