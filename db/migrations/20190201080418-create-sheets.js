'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sheets', {
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      gender: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      birthYear: {
        type: Sequelize.STRING(7)
      },
      birthMonth: {
        type: Sequelize.STRING(7)
      },
      birthDate: {
        type: Sequelize.STRING(7)
      },
      residence: {
        type: Sequelize.STRING(127)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('sheets');
  }
};
