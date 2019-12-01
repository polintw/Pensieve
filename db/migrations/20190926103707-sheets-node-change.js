'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('sheets_node', 'residence_history', {
      type: Sequelize.STRING(255),
      defaultValue: "[]"
    }).then(()=>{
      return queryInterface.changeColumn('sheets_node', 'stay_history', {
        type: Sequelize.STRING(255),
        defaultValue: "[]"
      })
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('sheets_node', 'residence_history', {
      type: Sequelize.STRING(255),
    }).then(()=>{
      return queryInterface.changeColumn('sheets_node', 'stay_history', {
        type: Sequelize.STRING(255),
      })
    });
  }
};
