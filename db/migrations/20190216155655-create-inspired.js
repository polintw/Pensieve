'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('inspired', {
      id_mark: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(()=>{
      return queryInterface.addConstraint('inspired', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_inspired_iduser',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('inspired', ['id_mark'], {
        type: 'foreign key',
        name: 'constraint_fkey_inspired_idmark',
        references: { //Required field
          table: 'marks',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('inspired');
  }
};
