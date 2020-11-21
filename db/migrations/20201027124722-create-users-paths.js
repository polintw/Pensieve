'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users_paths', {
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      id_path: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      pathName: {
        type: Sequelize.STRING(127),
        allowNull: false,
      },
      role: {
        type: Sequelize.TEXT('tiny')
      },
      deletedAt: {
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
      return queryInterface.addConstraint('users_paths', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_userspaths_iduser',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('users_paths', ['id_path'], {
        type: 'foreign key',
        name: 'constraint_fkey_userspaths_idpath',
        references: { //Required field
          table: 'paths',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users_paths');
  }
};
