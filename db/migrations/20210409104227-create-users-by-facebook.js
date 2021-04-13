'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users_by_facebook', {
      id_byFb: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fb_id: {
        type: Sequelize.STRING(31),
        allowNull: false,
      },
      fb_account: {
        type: Sequelize.STRING(127)
      },
      fb_email: {
        type: Sequelize.STRING(127)
      },
      fb_profilePic: {
        type: Sequelize.STRING(1023)
      },
      fb_birth: {
        type: Sequelize.INTEGER
      },
      fb_gender: {
        type: Sequelize.TEXT('tiny'),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users_by_facebook');
  }
};
