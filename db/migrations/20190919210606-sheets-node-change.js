'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('sheets_node', 'residence', {
      type: Sequelize.INTEGER(10).UNSIGNED
    }).then(()=>{
      return queryInterface.changeColumn('sheets_node', 'residence_history', {
        type: Sequelize.INTEGER(10).UNSIGNED
      })
    }).then(()=>{
      return queryInterface.changeColumn('sheets_node', 'hometown', {
        type: Sequelize.INTEGER(10).UNSIGNED
      })
    }).then(()=>{
      return queryInterface.changeColumn('sheets_node', 'stay', {
        type: Sequelize.INTEGER(10).UNSIGNED
      })
    }).then(()=>{
      return queryInterface.changeColumn('sheets_node', 'stay_history', {
        type: Sequelize.INTEGER(10).UNSIGNED
      })
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('sheets_node', 'residence', {
      allowNull: false,
      type: Sequelize.INTEGER(10).UNSIGNED
    }).then(()=>{
      return queryInterface.changeColumn('sheets_node', 'residence_history', {
        allowNull: false,
        type: Sequelize.INTEGER(10).UNSIGNED
      })
    }).then(()=>{
      return queryInterface.changeColumn('sheets_node', 'hometown', {
        allowNull: false,
        type: Sequelize.INTEGER(10).UNSIGNED
      })
    }).then(()=>{
      return queryInterface.changeColumn('sheets_node', 'stay', {
        allowNull: false,
        type: Sequelize.INTEGER(10).UNSIGNED
      })
    }).then(()=>{
      return queryInterface.changeColumn('sheets_node', 'stay_history', {
        allowNull: false,
        type: Sequelize.INTEGER(10).UNSIGNED
      })
    });
  }
};
