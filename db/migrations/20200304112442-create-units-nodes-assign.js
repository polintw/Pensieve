'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('units_nodes_assign', {
      id_unit: {
        type: Sequelize.UUID,
        allowNull: false
      },
      id_author: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      nodeAssigned: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      belongTypes: {
        type: Sequelize.STRING(31)
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
      return queryInterface.addConstraint('units_nodes_assign', ['id_unit'], {
        type: 'foreign key',
        name: 'constraint_fkey_unitsNodes_assign_idunit',
        references: { //Required field
          table: 'units',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('units_nodes_assign', ['id_author'], {
        type: 'foreign key',
        name: 'constraint_fkey_unitsNodes_assign_idAuthor',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('units_nodes_assign', ['nodeAssigned'], {
        type: 'foreign key',
        name: 'constraint_fkey_unitsNodes_assign_nodeAssigned',
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
    return queryInterface.dropTable('units_nodes_assign');
  }
};
