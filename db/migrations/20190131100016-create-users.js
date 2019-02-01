'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      first_name: {
        type: Sequelize.STRING(63),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(63),
        allowNull: false
      },
      account: {
        type: Sequelize.STRING(127),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(127),
        allowNull: false
      },
      status: Sequelize.TEXT('tiny'),
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(()=>{
      return queryInterface.addConstraint('users_apply', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_usersapply_iduser',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
    }).then(()=>{
      return queryInterface.addConstraint('verifications', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_verifications_iduser',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
    }).then(()=>{
      return queryInterface.addConstraint('sheets', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_sheets_iduser',
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
    return queryInterface.dropTable('users');
  }
};
