'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('units_paths_subdis_sign', {
      id_unit: {
        type: Sequelize.UUID,
        allowNull: false
      },
      id_path: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      id_subPath: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      used_userId: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      userId_Identity: {
        type: Sequelize.TEXT('tiny')
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
    return queryInterface.dropTable('units_paths_subdis_sign');
  }
};
