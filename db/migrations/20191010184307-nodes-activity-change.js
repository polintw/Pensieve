'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('nodes_activity', 'id_firstUnit', {
      type: Sequelize.UUID,
      allowNull: false //beacuse at the moment the record was created, there must be a Unit used it
    }).then(()=>{
      return queryInterface.addConstraint('nodes_activity', ['id_firstUnit'], {
        type: 'foreign key',
        name: 'constraint_fkey_nodesactivity_idfirstUnit',
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
    return queryInterface.removeColumn('nodes_activity', 'id_firstUnit', {});
  }
};
