'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('paths_subcate', 'description', {
      type: Sequelize.STRING(255)
    });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('paths_subcate', 'description', {});
  }
};
