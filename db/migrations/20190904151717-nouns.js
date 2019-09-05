'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('nouns', 'category', {
      type: Sequelize.STRING, //not a 'tinytext' just because, Sequelize will return err for setting default value on windows...
      defaultValue: 'location_admin'
      //at this moment, we got only administative
    }).then(()=>{
      return queryInterface.addColumn('nouns', 'parent', {
        type: Sequelize.BOOLEAN,
        defaultValue: Sequelize.literal(0)
      })
    }).then(()=>{
      return queryInterface.addColumn('nouns', 'child', {
        type: Sequelize.BOOLEAN,
        defaultValue: Sequelize.literal(0)
      })
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('nouns', 'category', {})
    .then(()=>{
      return queryInterface.removeColumn('nouns', 'parent', {});
    }).then(()=>{
      return queryInterface.removeColumn('nouns', 'child', {});
    });
  }
};
