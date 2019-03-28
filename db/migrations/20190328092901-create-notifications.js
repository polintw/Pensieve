'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('notifications', {
      id_reciever: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED
      },
      id_unit: {
        type: Sequelize.INTEGER(10).UNSIGNED
      },
      type: {
        type: Sequelize.TEXT('tiny'),
        allowNull: false
      },
      status: {
        type: Sequelize.TEXT('tiny'),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }).then(()=>{
      return queryInterface.addConstraint('notifications', ['id_reciever'], {
        type: 'foreign key',
        name: 'constraint_fkey_notifications_idreciever',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('notifications', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_notifications_iduser',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('notifications', ['id_unit'], {
        type: 'foreign key',
        name: 'constraint_fkey_notifications_idunit',
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
    return queryInterface.dropTable('notifications');
  }
};
