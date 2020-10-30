'use strict';
module.exports = (sequelize, DataTypes) => {
  const paths = sequelize.define('paths', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      charset: 'utf8mb4' //for Mandarin, or emoji if you don't speak in mandarin
    },
    id_creator: DataTypes.INTEGER,
    pathName: { // a unique name used in URL param representing this path project
      type: DataTypes.STRING,
      unique: true
    },
    description:{
      type: DataTypes.STRING,
      charset: 'utf8mb4' //for Mandarin, or emoji if you don't speak in mandarin
    },
    set_webLink: {
      type: DataTypes.STRING,
      charset: 'utf8mb4' //for Mandarin, or emoji if you don't speak in mandarin
    },
    set_nodeStart: DataTypes.INTEGER
  }, {
    paranoid: true,
  });
  paths.associate = function(models) {
    paths.belongsTo(models.users, {
      foreignKey:"id_creator",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    paths.hasMany(models.users_paths, {
      foreignKey:"id_path",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  return paths;
};
