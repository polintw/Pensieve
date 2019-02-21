'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      first_name: {
        type: Sequelize.STRING(63),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(63),
        allowNull: false
      },
      account: {
        type: Sequelize.STRING(127),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(127),
        allowNull: false
      },
      status: {
        type: Sequelize.TEXT('tiny'),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    },{
      charset: 'utf8mb4', //for Mandarin, or emoji if you don't speak in mandarin
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
