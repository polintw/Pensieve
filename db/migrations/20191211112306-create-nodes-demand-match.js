'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('nodes_demand_match', {
      id_node: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      locked: {
        type: Sequelize.BOOLEAN,
        defaultValue: Sequelize.literal(0)
      },
      finished: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        defaultValue: Sequelize.literal(0)
      },
      supply: {
        type: Sequelize.BOOLEAN
      },
      lockedAt: {
        type: Sequelize.DATE
      },
      list_demand: {
        type: Sequelize.STRING(511)
      },
      list_willing: {
        type: Sequelize.STRING(511)
      },
      list_taking: {
        type: Sequelize.STRING(511),
        defaultValue: "[]"
      },
      list_waiting: {
        type: Sequelize.STRING(511),
        defaultValue: "[]"
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }).then(()=>{
      return queryInterface.addConstraint('nodes_demand_match', ['id_node'], {
        type: 'foreign key',
        name: 'constraint_fkey_nodesDemandMatch_idnode',
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
    return queryInterface.dropTable('nodes_demand_match');
  }
};
