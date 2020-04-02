'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('nouns', 'parent_id', {
      type: Sequelize.INTEGER(10).UNSIGNED
    })
    .then(()=>{
      //this column add, but not going to insert anythig this time
      return queryInterface.addColumn('nouns', 'prefix_correspond_id', {
        type: Sequelize.INTEGER(10).UNSIGNED
      })
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('nouns', 'parent_id', {})
    .then(()=>{
      return queryInterface.removeColumn('nouns', 'prefix_correspond_id', {})
    });
  }
};
