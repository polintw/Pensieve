'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    async function constraintRm(constraint, table){
      return await queryInterface.removeConstraint(table, constraint)
    };
    function constraintAddBack(constraint, table, col){
      return queryInterface.addConstraint(table, [col], {
        type: 'foreign key',
        name: constraint,
        references: { //Required field
          table: 'units',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    };
    function typeChange(table, col, nullLimit){
      return queryInterface.changeColumn(table, col, {
        type: Sequelize.UUID,
        allowNull: !!nullLimit? true:false
      });
    };

    let addBackList = [
      new Promise((resolve, reject)=>{constraintAddBack('constraint_fkey_broad_idunit', 'broads', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{constraintAddBack('constraint_fkey_usersunits_idunit', 'users_units', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{constraintAddBack('constraint_fkey_nodesactivity_idfirstUnit', 'nodes_activity', 'id_firstUnit').then(resolve());}),
      new Promise((resolve, reject)=>{constraintAddBack('constraint_fkey_unitsAuthor_idunit', 'units_author', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{constraintAddBack('constraint_fkey_notifications_idunit', 'notifications', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{constraintAddBack('constraint_fkey_notifiofinspired_idunit', 'notifi_inspired', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{constraintAddBack('constraint_fkey_attribution_idunit', 'attribution', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{constraintAddBack('constraint_fkey_marks_idunit', 'marks', 'id_unit').then(resolve());})
    ];
    let rmList = [
      new Promise((resolve, reject)=>{constraintRm('constraint_fkey_broad_idunit', 'broads').then(resolve());}),
      new Promise((resolve, reject)=>{constraintRm('constraint_fkey_usersunits_idunit', 'users_units').then(resolve());}),
      new Promise((resolve, reject)=>{constraintRm('constraint_fkey_nodesactivity_idfirstUnit', 'nodes_activity').then(resolve());}),
      new Promise((resolve, reject)=>{constraintRm('constraint_fkey_unitsAuthor_idunit', 'units_author').then(resolve());}),
      new Promise((resolve, reject)=>{constraintRm('constraint_fkey_notifications_idunit', 'notifications').then(resolve());}),
      new Promise((resolve, reject)=>{constraintRm('constraint_fkey_notifiofinspired_idunit', 'notifi_inspired').then(resolve());}),
      new Promise((resolve, reject)=>{constraintRm('constraint_fkey_attribution_idunit', 'attribution').then(resolve());}),
      new Promise((resolve, reject)=>{constraintRm('constraint_fkey_marks_idunit', 'marks').then(resolve());})
    ];
    let typeChangeList = [
      new Promise((resolve, reject)=>{typeChange('broads', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{typeChange('users_units', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{typeChange('nodes_activity', 'id_firstUnit').then(resolve());}),
      new Promise((resolve, reject)=>{typeChange('units_author', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{typeChange('notifications', 'id_unit', 'nullLimit').then(resolve());}),
      new Promise((resolve, reject)=>{typeChange('notifi_inspired', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{typeChange('attributes', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{typeChange('marks', 'id_unit').then(resolve());}),
    ];

    return Promise.all(rmList)
    .then(()=>{
      return queryInterface.changeColumn('units', 'id', {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      });
    })
    .then(()=>{
      return Promise.all(typeChangeList);
    })
    .then(()=>{
      return Promise.all(addBackList);
    })
    .then(()=>{
      return queryInterface.addColumn('units', 'exposedId', {
        type: Sequelize.UUID,
        defaultValue: function(){
          console.log('making default exposedId')
          /*
          reference: https://cythilya.github.io/2017/03/12/uuid/
          */
          let d = new Date();
          d = d.now(); //milliseconds, similat to getTime().
          return 'xxxxxx-yxx-xxx-yxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
          });

        },
        //Not to forbidden default Null at this moment.
        unique: true
      })
    });
  },

  down: (queryInterface, Sequelize) => {
    async function constraintRm(constraint){
      return await queryInterface.removeConstraint('units', constraint)
    };
    function constraintAddBack(constraint, table, col){
      return queryInterface.addConstraint(table, [col], {
        type: 'foreign key',
        name: constraint,
        references: { //Required field
          table: 'units',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    };
    function typeChange(table, col, nullLimit){
      return queryInterface.changeColumn(table, col, {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: !!nullLimit? true:false
      });
    };
    let addBackList = [
      new Promise((resolve, reject)=>{constraintAddBack('constraint_fkey_broad_idunit', 'broads', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{constraintAddBack('constraint_fkey_usersunits_idunit', 'users_units', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{constraintAddBack('constraint_fkey_nodesactivity_idfirstUnit', 'nodes_activity', 'id_firstUnit').then(resolve());}),
      new Promise((resolve, reject)=>{constraintAddBack('constraint_fkey_unitsAuthor_idunit', 'units_author', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{constraintAddBack('constraint_fkey_notifications_idunit', 'notifications', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{constraintAddBack('constraint_fkey_notifiofinspired_idunit', 'notifi_inspired', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{constraintAddBack('constraint_fkey_attribution_idunit', 'attribution', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{constraintAddBack('constraint_fkey_marks_idunit', 'marks', 'id_unit').then(resolve());})
    ];
    let rmList = [
      new Promise((resolve, reject)=>{constraintRm('constraint_fkey_broad_idunit', 'broads').then(resolve());}),
      new Promise((resolve, reject)=>{constraintRm('constraint_fkey_usersunits_idunit', 'users_units').then(resolve());}),
      new Promise((resolve, reject)=>{constraintRm('constraint_fkey_nodesactivity_idfirstUnit', 'nodes_activity').then(resolve());}),
      new Promise((resolve, reject)=>{constraintRm('constraint_fkey_unitsAuthor_idunit', 'units_author').then(resolve());}),
      new Promise((resolve, reject)=>{constraintRm('constraint_fkey_notifications_idunit', 'notifications').then(resolve());}),
      new Promise((resolve, reject)=>{constraintRm('constraint_fkey_notifiofinspired_idunit', 'notifi_inspired').then(resolve());}),
      new Promise((resolve, reject)=>{constraintRm('constraint_fkey_attribution_idunit', 'attribution').then(resolve());}),
      new Promise((resolve, reject)=>{constraintRm('constraint_fkey_marks_idunit', 'marks').then(resolve());})
    ];
    let typeChangeList = [
      new Promise((resolve, reject)=>{typeChange('broads', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{typeChange('users_units', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{typeChange('nodes_activity', 'id_firstUnit').then(resolve());}),
      new Promise((resolve, reject)=>{typeChange('units_author', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{typeChange('notifications', 'id_unit', 'nullLimit').then(resolve());}),
      new Promise((resolve, reject)=>{typeChange('notifi_inspired', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{typeChange('attributes', 'id_unit').then(resolve());}),
      new Promise((resolve, reject)=>{typeChange('marks', 'id_unit').then(resolve());}),
    ];

    return queryInterface.removeColumn('units', 'exposedId', {})
    .then(()=>{
      Promise.all(rmList)
    })
    .then(()=>{
      return queryInterface.changeColumn('units', 'id', {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
      });
    })
    .then(()=>{
      return Promise.all(typeChangeList);
    })
    .then(()=>{
      return Promise.all(addBackList);
    });
  }
};
