const fs = require("fs");
const browserify = require('browserify');
const babelify = require("babelify");

let dir = './public/react';

let rootSign = browserify({debug: true}).transform(babelify.configure({
  presets: [
      "react",
      "env"
    ],
  plugins: [
    "transform-object-rest-spread"
  ]})
).require("./app/Sign/root.js", {entry: true}).plugin(require('css-modulesify'), {
    rootDir: __dirname
  });
let rootService = browserify({debug: true}).transform(babelify.configure({
  presets: [
      "react",
      "env"
    ],
  plugins: [
    "transform-object-rest-spread"
  ]})
).require("./app/Service/root.js", {entry: true}).plugin(require('css-modulesify'), {
    rootDir: __dirname
  });
let rootWithin = browserify({debug: true}).transform(babelify.configure({
  presets: [
      "react",
      "env"
    ],
  plugins: [
    "transform-object-rest-spread"
  ]})
).require("./app/Within/root.js", {entry: true}).plugin(require('css-modulesify'), {
    rootDir: __dirname
  });
let rootSelfFront = browserify({debug: true}).transform(babelify.configure({
  presets: [
      "react",
      "env"
    ],
  plugins: [
  	"transform-object-rest-spread"
  ]})
).require("./app/Self/root_Front.js", {entry: true}).plugin(require('css-modulesify'), {
    rootDir: __dirname
  });


let appSign = rootSign.bundle().on("error", function (err) { console.log("Error: " + err.message); });
let appService = rootService.bundle().on("error", function (err) { console.log("Error: " + err.message); });
let appWithin = rootWithin.bundle().on("error", function (err) { console.log("Error: " + err.message); });
let appSelfFront = rootSelfFront.bundle().on("error", function (err) { console.log("Error: " + err.message); });

rootSign.on('css stream', function (css) {
    css.pipe(fs.createWriteStream('./public/css/stylesSign.css')); //rewrite the file with the new "abstract name"
});
rootService.on('css stream', function (css) {
    css.pipe(fs.createWriteStream('./public/css/stylesService.css')); //rewrite the file with the new "abstract name"
});
rootWithin.on('css stream', function (css) {
    css.pipe(fs.createWriteStream('./public/css/stylesWithin.css')); //rewrite the file with the new "abstract name"
});
rootSelfFront.on('css stream', function (css) {
    css.pipe(fs.createWriteStream('./public/css/stylesSelfFront.css')); //rewrite the file with the new "abstract name"
});

exports.bundler = ()=>{
  if(!fs.existsSync(dir)) fs.mkdirSync(dir);
  appSign.pipe(fs.createWriteStream('./public/react/appSign.js'));
  appService.pipe(fs.createWriteStream('./public/react/appService.js'));
  appWithin.pipe(fs.createWriteStream('./public/react/appWithin.js'));
  appSelfFront.pipe(fs.createWriteStream('./public/react/appSelfFront.js'));
}
