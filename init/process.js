//from https://gist.github.com/millermedeiros/4724047 by millermedeiros
// execute a single shell command where "cmd" is a string
let child_process = require('child_process');

const exec = function(cmd, cb){
    let parts = cmd.split(/\s+/g);
    let p = child_process.spawn(parts[0], parts.slice(1), {stdio: 'inherit'});
    p.on('exit', function(code){
        let err = null;
        if (code) {
            err = new Error('command "'+ cmd +'" exited with wrong status code "'+ code +'"');
            err.code = code;
            err.cmd = cmd;
        }
        if (cb) cb(err);
    });
};

// execute multiple commands in series
// this could be replaced by any flow control lib
const execSeries = function(cmds, cb){
    let execNext = function(){
        exec(cmds.shift(), function(err){
            if (err) {
                cb(err);
            } else {
                if (cmds.length) execNext();
                else cb(null);
            }
        });
    };
    execNext();
};

module.exports.install = ()=>{
  //modify config if you change the path
  execSeries([
    'npm install',
    'mkdir ~/faked',
    'mkdir ~/faked/pics',
    'mkdir ~/faked/pics/1',
    'mkdir ~/faked/logs',
    'mkdir ~/faked/dbSeeds',
    'cp ~/config/.env.example.json ~/config/.env.json'
  ])
}

module.exports.installWin = ()=>{
  //modify config if you change the path
  execSeries([
    'npm install',
    "New-Item -Path '\\faked' -ItemType Directory",
    "New-Item -Path '\\faked\pics' -ItemType Directory",
    "New-Item -Path '\\faked\pics\1' -ItemType Directory",
    "New-Item -Path '\\faked\logs' -ItemType Directory",
    "New-Item -Path '\\faked\dbSeeds' -ItemType Directory",
    "Copy-Item -Path \\config\.env.example.json -Destination \\config\.env.json"
  ])
}

module.exports.migrate = ()=>{
  execSeries([
    'npx sequelize db:create',
    'npx sequelize db:migrate',
    'npx sequelize db:seed --seed 20190214121202-init-nouns.js',
    'npx sequelize db:seed --seed 20190214devaccount-init-user.js'
  ])
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
