'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_by_facebook = sequelize.define('users_by_facebook', {
    id_byFb: DataTypes.INTEGER,
    fb_id: DataTypes.STRING,
    fb_account: DataTypes.STRING,
    fb_email: DataTypes.STRING,
    fb_profilePic: DataTypes.STRING,
    fb_birth: DataTypes.INTEGER,
    fb_gender: DataTypes.STRING
  }, {
    charset: 'utf8mb4' //for Mandarin, or emoji if you don't speak in mandarin
  });
  users_by_facebook.associate = function(models) {
    // associations can be defined here
  };
  users_by_facebook.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return users_by_facebook;
};
