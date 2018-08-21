const fs = require("fs");
const browserify = require('browserify');
const babelify = require("babelify");

let rootLogin = browserify({debug: true}).transform(babelify.configure({
  presets: [
      "react",
      "env"
  ]})).require("../app/Login/root.js", {entry: true})/*.plugin(require('css-modulesify'), {
    rootDir: __dirname
  });*/
let rootWithin = browserify({debug: true}).transform(babelify.configure({
  presets: [
      "react",
      "env"
  ]})).require("../app/Within/root.js", {entry: true})/*.plugin(require('css-modulesify'), {
    rootDir: __dirname
  });*/
let rootSelfFront = browserify({debug: true}).transform(babelify.configure({
  presets: [
      "react",
      "env"
  ]})).require("../app/Self/root_Front.js", {entry: true})/*.plugin(require('css-modulesify'), {
    rootDir: __dirname
  });*/
let rootSelfCover = browserify({debug: true}).transform(babelify.configure({
  presets: [
      "react",
      "env"
  ]})).require("../app/SelfCover/root_SelfCover.js", {entry: true})/*.plugin(require('css-modulesify'), {
    rootDir: __dirname
  });*/

let appLogin = rootLogin.bundle().on("error", function (err) { console.log("Error: " + err.message); });
let appWithin = rootWithin.bundle().on("error", function (err) { console.log("Error: " + err.message); });
let appSelfFront = rootSelfFront.bundle().on("error", function (err) { console.log("Error: " + err.message); });
let appSelfCover = rootSelfCover.bundle().on("error", function (err) { console.log("Error: " + err.message); });
/*rootSelf.on('css stream', function (css) {
    css.pipe(fs.createWriteStream('../server_statics/public/styles.css')); //rewrite the file with the new "abstract name"
});*/

appLogin.pipe(fs.createWriteStream('../public/react/appLogin.js'));
appWithin.pipe(fs.createWriteStream('../public/react/appWithin.js'));
appSelfFront.pipe(fs.createWriteStream('../public/react/appSelfFront.js'));
appSelfCover.pipe(fs.createWriteStream('../public/react/appSelfCover.js'));
