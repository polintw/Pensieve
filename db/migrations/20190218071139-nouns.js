'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('nouns', 'language', {
      type: Sequelize.TEXT('tiny'),
      allowNull: false
    }, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('nouns', 'language', {});
  }
};
