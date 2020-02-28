'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('marks', 'editor_content', {})
    .then(()=>{
      return queryInterface.removeColumn('marks', 'created', {});
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('marks', 'editor_content', {
      type: Sequelize.STRING(2047)
    })
    .then(()=>{
      return queryInterface.addColumn('marks', 'created', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      });
    });
  }
};
