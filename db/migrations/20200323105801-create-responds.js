'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('responds', {
      id_unit: {
        type: Sequelize.UUID,
        allowNull: false
      },
      id_primer: {
        type: Sequelize.UUID,
        allowNull: false
      },
      id_author: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      primer_author: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      primer_createdAt: {
        type: Sequelize.DATE
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
      return queryInterface.addConstraint('responds', ['id_unit'], {
        type: 'foreign key',
        name: 'constraint_fkey_responds_idunit',
        references: { //Required field
          table: 'units',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('responds', ['id_primer'], {
        type: 'foreign key',
        name: 'constraint_fkey_responds_idprimer',
        references: { //Required field
          table: 'units',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('responds', ['id_author'], {
        type: 'foreign key',
        name: 'constraint_fkey_responds_idauthor',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('responds', ['primer_author'], {
        type: 'foreign key',
        name: 'constraint_fkey_responds_primerAuthor',
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
    return queryInterface.dropTable('responds');
  }
};
