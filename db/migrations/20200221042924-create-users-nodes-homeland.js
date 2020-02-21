'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users_nodes_homeland', {
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      id_node: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      historyify: {
        type: Sequelize.BOOLEAN,
        defaultValue: Sequelize.literal(0)
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
      return queryInterface.addConstraint('users_nodes_homeland', ['id_node'], {
        type: 'foreign key',
        name: 'constraint_fkey_usersnodesHomeland_idnode',
        references: { //Required field
          table: 'nouns',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('users_nodes_homeland', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_usersnodesHomeland_iduser',
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
    return queryInterface.dropTable('users_nodes_homeland');
  }
};
