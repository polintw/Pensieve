'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('nouns', {
      id: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(127),
        allowNull: false
      },
      prefix: {
        type: Sequelize.STRING(127)
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
      charset: 'utf8mb4' //for Mandarin, or emoji if you don't speak in mandarin
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('nouns');
  }
};
