'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('lastUpdate_nodeBelongs', {
      id_node: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      item: {
        type: Sequelize.STRING(31)
      },
      increase: {
        type: Sequelize.BOOLEAN,
        defaultValue: Sequelize.literal(0)
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }).then(()=>{
      return queryInterface.addConstraint('lastUpdate_nodeBelongs', ['id_node'], {
        type: 'foreign key',
        name: 'constraint_fkey_lastUpdate_nodeBelongs_idnode',
        references: { //Required field
          table: 'nouns',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('lastUpdate_nodeBelongs', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_lastUpdate_nodeBelongs_iduser',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('lastUpdate_nodeBelongs');
  }
};
