'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('units_author', 'broaded', {
      type: Sequelize.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: 0
  });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('units_author', 'broaded', {});
  }
};
