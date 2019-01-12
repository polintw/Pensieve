let bundler;
if (process.env.NODE_ENV == 'development') {
  bundler = require('./package/bunDevelope.js').bundler;
} else {
  bundler = require('./package/bunProduction.js').bundler;
}

bundler();
