'use strict';
const path = require('path');
const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {first_name: 'user', last_name: 'test', account: 'user test', status: 'newly', email: 'usertest@mail.com'}
    ], {})
    .then(()=>{
      return new Promise((resolve, reject)=>{
        bcrypt.genSalt(10, (err, salt) => {
          if(err) throw 'There was an error'+err;
          bcrypt.hash('helloworld', salt, (err, hash) => {
            if(err) throw 'There was an error'+err;
            queryInterface.bulkInsert('verifications', [
              {id_user: '1', email: 'usertest@mail.com', password: hash}
            ], {}).then(()=>{
              resolve();
            })
          })
        });
      })
    })
    .then(()=>{
      return queryInterface.bulkInsert('users_apply', [
        {id_user: '1', token_email: 'actuallythisisnotavalidtoken', status: 'newly'}
      ], {})
    })
    .then(()=>{
      return queryInterface.bulkInsert('sheets', [
        {id_user: '1', gender: '0', birthYear: '1990', birthMonth: '01', birthDate: '01'}
      ], {})
    })
    .then(()=>{
      return queryInterface.bulkInsert('lastvisit_index', [
        {id_user: '1'}
      ], {})
    })
    .then(()=>{
      return queryInterface.bulkInsert('list_mails', [
        {id_user: '1'}
      ], {})
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users",{
      id:'1'
    }); //should delete the test user due to we combine by cascade
  }
};
