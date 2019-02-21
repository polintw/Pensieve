'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('units', 'established', {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('units', 'established', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }, {});
  }
};
