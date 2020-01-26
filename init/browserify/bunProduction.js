const fs = require("fs");
const browserify = require('browserify');
const babelify = require("babelify");
const envify = require("envify/custom");

let dir = './public/react';

let rootSign = browserify({
  debug: false
}).transform(envify({
  NODE_ENV: 'production'
})).transform(babelify.configure({
  presets: [
      "react",
      "env"],
  plugins: [
      "transform-object-rest-spread"
  ]
})).transform('uglifyify', {
  global: true
}).require("./app/Sign/root.js", {
  entry: true
}).plugin(require('css-modulesify'), {
    rootDir: __dirname
  });
let rootAbout = browserify({
  debug: false
}).transform(envify({
  NODE_ENV: 'production'
})).transform(babelify.configure({
  presets: [
      "react",
      "env"],
  plugins: [
      "transform-object-rest-spread"
  ]
})).transform('uglifyify', {
  global: true
}).require("./app/About/root.js", {
  entry: true
}).plugin(require('css-modulesify'), {
    rootDir: __dirname
  });
let rootWithin = browserify({
  debug: false
}).transform(envify({
  NODE_ENV: 'production'
})).transform(babelify.configure({
  presets: [
      "react",
      "env"],
  plugins: [
      "transform-object-rest-spread"
  ]
})).transform('uglifyify', {
  global: true
}).require("./app/Within/root.js", {
  entry: true
}).plugin(require('css-modulesify'), {
    rootDir: __dirname
  });
let rootSelfFront = browserify({
  debug: false
}).transform(envify({
  NODE_ENV: 'production'
})).transform(babelify.configure({
  presets: [
      "react",
      "env"],
  plugins: [
      "transform-object-rest-spread"
  ]
})).transform('uglifyify', {
  global: true
}).require("./app/Self/root_Front.js", {
  entry: true
}).plugin(require('css-modulesify'), {
    rootDir: __dirname
  });
/*let rootTerrace = browserify({
  debug: false
}).transform(envify({
  NODE_ENV: 'production'
})).transform(babelify.configure({
  presets: [
      "react",
      "env"],
  plugins: [
      "transform-object-rest-spread"
  ]
})).transform('uglifyify', {
  global: true
}).require("./app/Terrace/root_Terrace.js", {
  entry: true
}).plugin(require('css-modulesify'), {
    rootDir: __dirname
  });*/

let appSign = rootSign.bundle().on("error", function (err) { console.log("Error: " + err.message); });
let appAbout = rootAbout.bundle().on("error", function (err) { console.log("Error: " + err.message); });
let appWithin = rootWithin.bundle().on("error", function (err) { console.log("Error: " + err.message); });
let appSelfFront = rootSelfFront.bundle().on("error", function (err) { console.log("Error: " + err.message); });
//let appTerrace = rootTerrace.bundle().on("error", function (err) { console.log("Error: " + err.message); });
rootSign.on('css stream', function (css) {
    css.pipe(fs.createWriteStream('./public/css/stylesSign.css')); //rewrite the file with the new "abstract name"
});
rootAbout.on('css stream', function (css) {
    css.pipe(fs.createWriteStream('./public/css/stylesAbout.css')); //rewrite the file with the new "abstract name"
});
rootWithin.on('css stream', function (css) {
    css.pipe(fs.createWriteStream('./public/css/stylesWithin.css')); //rewrite the file with the new "abstract name"
});
rootSelfFront.on('css stream', function (css) {
    css.pipe(fs.createWriteStream('./public/css/stylesSelfFront.css')); //rewrite the file with the new "abstract name"
});
/*rootTerrace.on('css stream', function (css) {
    css.pipe(fs.createWriteStream('./public/css/stylesTerrace.css')); //rewrite the file with the new "abstract name"
});*/

exports.bundler = ()=>{
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  appSign.pipe(fs.createWriteStream('./public/react/appSign.js'));
  appAbout.pipe(fs.createWriteStream('./public/react/appAbout.js'));
  appWithin.pipe(fs.createWriteStream('./public/react/appWithin.js'));
  appSelfFront.pipe(fs.createWriteStream('./public/react/appSelfFront.js'));
  //appTerrace.pipe(fs.createWriteStream('./public/react/appTerrace.js'));
}
