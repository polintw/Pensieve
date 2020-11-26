// from https://stackoverflow.com/questions/36959253/how-can-i-execute-shell-commands-in-sequence
// by jfriend00
const {exec} = require('child_process');

function runCommands(array, callback) {
    var index = 0;
    var results = [];

    function next() {
       if (index < array.length) {
           console.log(array[index])
           exec(array[index], function(err, stdout, stderr) {
               if (err) return callback(err);
               if (stderr) return callback(err);
               // do the next iteration
               results.push(stdout);
               index++;
               next();
           });
       } else {
           // all done here
           console.log('all done, there is no err')
           callback(null, results);
       }
    }
    // start the first iteration
    next();
}


module.exports.setUp = ()=>{
  //modify config if you change the path
  const commands = [
    'mkdir -p ./faked/pics/1',
    'mkdir -p ./faked/logs',
    'mkdir -p ./faked/dbSeeds',
    'cp ./config/.env.example.json ./config/.env.json', //need to watch the difference between the setUpWin below
  ]
  runCommands(commands, function(err, results) {
      // error or results here
      if(err) console.log(err)
      else console.log(results)
  });
}

module.exports.setUpWin = ()=>{
  //modify config if you change the path
  const commands = [
    "mkdir .\\faked\\dbSeeds",
    "mkdir .\\faked\\logs",
    "mkdir .\\faked\\pics\\1",
    'cp .\\config\\.env.example.json .\\config\\.env.json',
  ]

  runCommands(commands, function(err, results) {
      // error or results here
      if(err) console.log(err)
      else console.log(results)
  });
}

module.exports.migrate = ()=>{
  const commands = [
    'npx sequelize db:create',
    'npx sequelize db:migrate',
    'npx sequelize db:seed --seed 20190214121202-init-nouns.js',
    'npx sequelize db:seed --seed 20190214devaccount-init-user.js'
  ];
  runCommands(commands, function(err, results) {
      // error or results here
      if(err) console.log(err)
      else console.log(results)
  });
}

module.exports.build = ()=>{
  let bundler;
  if (process.env.NODE_ENV == 'development') {
    bundler = require('./browserify/bunDevelope.js').bundler;
  } else {
    bundler = require('./browserify/bunProduction.js').bundler;
  }

  bundler();
};
