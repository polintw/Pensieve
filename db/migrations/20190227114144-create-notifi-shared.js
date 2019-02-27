'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('notifi_shared', {
      id: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      id_unit: {
        type: Sequelize.INTEGER(10).UNSIGNED
      },
      type: {
        type: Sequelize.TEXT('tiny')
      },
      status: {
        type: Sequelize.INTEGER(2).UNSIGNED,
      },
      id_user_related: {
        type: Sequelize.INTEGER(10).UNSIGNED
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
      return queryInterface.addConstraint('notifi_shared', ['id_unit'], {
        type: 'foreign key',
        name: 'constraint_fkey_notifishared_idunit',
        references: { //Required field
          table: 'units',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('notifi_shared', ['id_user_related'], {
        type: 'foreign key',
        name: 'constraint_fkey_notifishared_iduserelated',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(() => {
      return queryInterface.addConstraint('notifi_shared', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_notifishared_iduser',
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
    return queryInterface.dropTable('notifi_shared');
  }
};
