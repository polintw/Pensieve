'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('nodes_locationAdmin', {
      id_node: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING(255)
      },
      location_lat: {
        type: Sequelize.DECIMAL(21, 16),
      },
      location_lon: {
        type: Sequelize.DECIMAL(21, 16),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }, {
      charset: 'utf8mb4' //for Mandarin, or emoji if you don't speak in mandarin
    }).then(()=>{
      return queryInterface.addConstraint('nodes_locationAdmin', ['id_node'], {
        type: 'foreign key',
        name: 'constraint_fkey_nodesAdditional_idNode',
        references: { //Required field
          table: 'nouns',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('nodes_locationAdmin');
  }
};
