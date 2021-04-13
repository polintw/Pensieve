'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('units_paths_subdistribute', {
      id_unit: {
        type: Sequelize.UUID,
        allowNull: false
      },
      id_path: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      id_subPath: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      serial_subPath: {
        type: Sequelize.INTEGER,
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
      return queryInterface.addConstraint('units_paths_subdistribute', ['id_unit'], {
        type: 'foreign key',
        name: 'constraint_fkey_unitsPathsSubdis_idunit',
        references: { //Required field
          table: 'units',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('units_paths_subdistribute', ['id_path'], {
        type: 'foreign key',
        name: 'constraint_fkey_unitsPathsSubdis_idpath',
        references: { //Required field
          table: 'paths',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('units_paths_subdistribute', ['id_subPath'], {
        type: 'foreign key',
        name: 'constraint_fkey_unitsPathsSubdis_idsubPath',
        references: { //Required field
          table: 'paths_subcate',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('units_paths_subdistribute');
  }
};
