let bundler;
if (process.env.NODE_ENV == 'development') {
  bundler = require('./browserify/bunDevelope.js').bundler;
} else {
  bundler = require('./browserify/bunProduction.js').bundler;
}

bundler();
