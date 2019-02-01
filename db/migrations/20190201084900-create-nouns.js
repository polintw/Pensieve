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
      established: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(()=>{
      return queryInterface.addConstraint('nouns', ['name'], {
        type: 'unique',
        name: 'constraint_unique_nouns_name'
      });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('nouns');
  }
};
