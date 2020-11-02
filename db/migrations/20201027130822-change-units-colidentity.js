'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('units', 'author_identity', {
      type: Sequelize.STRING(31),
      defaultValue: 'user'
    })
    .then(()=>{
      return queryInterface.addColumn('attribution', 'author_identity', {
        type: Sequelize.STRING(31),
        defaultValue: 'user'
      });
    })
    .then(()=>{
      return queryInterface.removeConstraint('units', 'constraint_fkey_units_idauthor')
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('units', 'author_identity', {})
    .then(()=>{
      return queryInterface.removeColumn('attribution', 'author_identity', {})
    })
    .then(()=>{
      return queryInterface.addConstraint('units', ['id_author'], {
        type: 'foreign key',
        name: 'constraint_fkey_units_idauthor',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });
  }
};
