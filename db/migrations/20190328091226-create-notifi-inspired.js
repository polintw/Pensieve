'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('notifi_inspired', {
      id: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id_mark: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      id_unit: {
        type: Sequelize.INTEGER(10).UNSIGNED,
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
      return queryInterface.addConstraint('notifi_inspired', ['id_unit'], {
        type: 'foreign key',
        name: 'constraint_fkey_notifiofinspired_idunit',
        references: { //Required field
          table: 'units',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('notifi_inspired', ['id_mark'], {
        type: 'foreign key',
        name: 'constraint_fkey_notifiofinspired_idmark',
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
    return queryInterface.dropTable('notifi_inspired');
  }
};
