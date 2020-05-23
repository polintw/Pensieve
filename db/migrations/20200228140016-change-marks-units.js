'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('marks', 'editor_content', {})
    .then(()=>{
      return queryInterface.removeColumn('marks', 'created', {});
    })
    .then(()=>{ //due to the order of update, we set allowNull to Null back in this file, not when the col(exposedId) was add
      return queryInterface.changeColumn('units', 'exposedId', {
        type: Sequelize.UUID,
        //new col, no need to set defaultValue(set in working model)
        unique: true,
        allowNull: false
      });
    })
    .then(()=>{ //just here for easier update
      return queryInterface.changeColumn('units', 'id_primer', {
        type: Sequelize.UUID
      });
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('marks', 'editor_content', {
      type: Sequelize.STRING(2047)
    })
    .then(()=>{
      return queryInterface.addColumn('marks', 'created', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      });
    });
  }
};
