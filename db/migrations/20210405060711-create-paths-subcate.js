'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('paths_subcate', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10).UNSIGNED,
      },
      exposedId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      id_path: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(127),
        allowNull: false,
      },
      id_creator: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
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
      return queryInterface.addConstraint('paths_subcate', ['id_path'], {
        type: 'foreign key',
        name: 'constraint_fkey_pathsSubcate_idpath',
        references: { //Required field
          table: 'paths',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('paths_subcate', ['id_creator'], {
        type: 'foreign key',
        name: 'constraint_fkey_pathsSubcate_idcreator',
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
    return queryInterface.dropTable('paths_subcate');
  }
};
