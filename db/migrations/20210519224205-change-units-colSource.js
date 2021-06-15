'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('units', 'source', {
        type: Sequelize.STRING(31)
    });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('units', 'source', {})
  }
};
