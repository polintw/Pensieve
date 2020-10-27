'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('units', 'author_identity', {
      type: Sequelize.STRING(31),
      defaultValue: 'user'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('units', 'author_identity', {})
  }
};
