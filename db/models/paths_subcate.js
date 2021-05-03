'use strict';
module.exports = (sequelize, DataTypes) => {
  const paths_subcate = sequelize.define('paths_subcate', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
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
    id_path: DataTypes.INTEGER,
    id_creator: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      charset: 'utf8mb4' //for Mandarin, or emoji if you don't speak in mandarin
    },
    description:{
      type: DataTypes.STRING,
      charset: 'utf8mb4' //for Mandarin, or emoji if you don't speak in mandarin
    }
  }, {});
  paths_subcate.associate = function(models) {
    paths_subcate.belongsTo(models.users, {
      foreignKey:"id_creator",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    paths_subcate.belongsTo(models.paths, {
      foreignKey:"id_path",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    paths_subcate.hasMany(models.units_paths_subdistribute, {
      foreignKey:"id_subPath",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  return paths_subcate;
};
