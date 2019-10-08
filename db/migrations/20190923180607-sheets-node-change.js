'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('sheets_node', 'residence_history', {
      type: Sequelize.STRING(255),
    }).then(()=>{
      return queryInterface.changeColumn('sheets_node', 'stay_history', {
        type: Sequelize.STRING(255),
      })
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('sheets_node', 'residence_history', {
      type: Sequelize.INTEGER(10).UNSIGNED
    }).then(()=>{
      return queryInterface.changeColumn('sheets_node', 'stay_history', {
        type: Sequelize.INTEGER(10).UNSIGNED
      })
    });
  }
};
