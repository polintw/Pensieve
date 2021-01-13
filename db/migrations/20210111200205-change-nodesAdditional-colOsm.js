'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('nodes_locationAdmin', 'osm_id', {
        type: Sequelize.INTEGER,
    })
    .then(() => {
        return queryInterface.addColumn('nodes_locationAdmin', 'wiki_data_id', {
            type: Sequelize.STRING(63),
        })
    })
    .then(() => {
      return queryInterface.addColumn('nodes_locationAdmin', 'wiki_pedia_name', {
        type: Sequelize.STRING(255),
      })
    });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('nodes_locationAdmin', 'osm_id', {})
      .then(() => {
          return queryInterface.removeColumn('nodes_locationAdmin', 'wiki_data_id', {})
      })
      .then(() => {
          return queryInterface.removeColumn('nodes_locationAdmin', 'wiki_pedia_name', {})
      });
  }
};
