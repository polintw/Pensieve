'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const update = (updateObj, identifier)=>{
      return queryInterface.bulkUpdate('nouns', updateObj, identifier);
    };

    const listNounsUpdate = [
      [{name: 'Honolulu'}, {name: "Honolulu County"}],
      [{name: 'Los Alamos County'}, {name: "Los Alamos County[v]"}],
      [{name: 'Menominee'}, {name: "Menominee County", prefix: "Wisconsin"}],
      [{name: 'New Orleans'}, {name: "Orleans Parish"}],
      [{name: 'Anaconda'}, {name: "Deer Lodge County"}],
      [{name: 'Butte'}, {name: "Silver Bow County"}],
      [{name: 'Columbus'}, {name: "Muscogee County"}],
      [{name: 'Cusseta'}, {name: "Chattahoochee County", prefix: "Georgia"}],
      [{name: 'Georgetown'}, {name: "Quitman County", prefix: "Georgia"}],
      [{name: 'Lexington'}, {name: "Fayette County", prefix: "Kentucky"}],
      [{name: 'Lynchburg'}, {name: "Moore County", prefix: "Tennessee"}],
      [{name: 'Macon'}, {name: "Bibb County", prefix: "Georgia"}],
      [{name: 'Philadelphia'}, {name: "Philadelphia County"}],
      [{name: 'Preston'}, {name: "Webster County", prefix: "Georgia"}],
      [{name: 'Statenville'}, {name: "Echols County", prefix: "Georgia"}],
      [{name: 'Manhattan'}, {name: "New York County", prefix: "New York"}],
      [{name: 'Brooklyn'}, {name: "Kings County", prefix: "New York"}],
      [{name: 'Staten Island'}, {name: 'Richmond County', prefix: "New York"}],
      [{name: 'Queens'}, {name: 'Queens County', prefix: "New York"}],
      [{name: 'Louisville'}, {name: 'Jefferson County', prefix: "Kentucky"}]
    ];

    const listNounsInsert = [
      {name: "New York City", prefix: "New York", language: "en",  category: "location_admin", "parent":"1", "child":"1"},
      {name: "Athens", prefix: "Georgia", language: "en",  category: "location_admin", "parent":"1", "child":"1"},
      {name: "Augusta", prefix: "Georgia", language: "en",  category: "location_admin", "parent":"1", "child":"1"},
      {name: "Baton Rouge", prefix: "Louisiana", language: "en",  category: "location_admin", "parent":"1", "child":"1"},
      {name: "Indianapolis", prefix: "Indiana", language: "en",  category: "location_admin", "parent":"1", "child":"1"},
      {name: "Jacksonville", prefix: "Florida", language: "en",  category: "location_admin", "parent":"1", "child":"1"},
      {name: "Kansas City", prefix: "Kansas", language: "en",  category: "location_admin", "parent":"1", "child":"1"},
      {name: "Nashville", prefix: "Tennessee", language: "en",  category: "location_admin", "parent":"1", "child":"1"},
      {name: "Tribune", prefix: "Kansas", language: "en",  category: "location_admin", "parent":"1", "child":"1"}
    ];

    const promiseUpdateList = listNounsUpdate.map((updateArr, index)=>{
      return new Promise((resolve, reject)=>{
        update(updateArr[0], updateArr[1]).then(()=> resolve()).catch((err)=> { throw err});
      })
    });

    return Promise.all(promiseUpdateList)
    .then(()=>{
      return queryInterface.bulkInsert('nouns', listNounsInsert);
    })
    .catch((err)=> {
      console.log(err);
    })
  },

  down: (queryInterface, Sequelize) => {

  }
};
