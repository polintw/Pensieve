'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('marks', {
      id: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id_author: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      id_unit: {
        type: Sequelize.UUID,
        allowNull: false
      },
      layer: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      portion_top: {
        type: Sequelize.FLOAT(12,9),
        allowNull: false
      },
      portion_left: {
        type: Sequelize.FLOAT(12,9),
        allowNull: false
      },
      editor_content: {
        type: Sequelize.STRING(2047),
        charset: 'utf8mb4'
      },
      serial: {
        type: Sequelize.INTEGER(3).UNSIGNED,
        allowNull: false
      },
      created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }).then(()=>{
      return queryInterface.addConstraint('marks', ['id_author'], {
        type: 'foreign key',
        name: 'constraint_fkey_marks_idauthor',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('marks', ['id_unit'], {
        type: 'foreign key',
        name: 'constraint_fkey_marks_idunit',
        references: { //Required field
          table: 'units',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('marks');
  }
};
