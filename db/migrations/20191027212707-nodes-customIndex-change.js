'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users_custom_index', 'last_feedGroup', {
      type: Sequelize.INTEGER(5).UNSIGNED,
      allowNull: false,
      defaultValue: 0
  });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users_custom_index', 'last_feedGroup', {});
  }
};
