const fs = require("fs");
const browserify = require('browserify');
const babelify = require("babelify");
const envify = require("envify/custom");

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
})/*.plugin(require('css-modulesify'), {
    rootDir: __dirname
  });*/
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
})/*.plugin(require('css-modulesify'), {
    rootDir: __dirname
  });*/
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
})/*.plugin(require('css-modulesify'), {
    rootDir: __dirname
  });*/
let rootTerrace = browserify({
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
})/*.plugin(require('css-modulesify'), {
    rootDir: __dirname
  });*/

let appSign = rootSign.bundle().on("error", function (err) { console.log("Error: " + err.message); });
let appWithin = rootWithin.bundle().on("error", function (err) { console.log("Error: " + err.message); });
let appSelfFront = rootSelfFront.bundle().on("error", function (err) { console.log("Error: " + err.message); });
let appTerrace = rootTerrace.bundle().on("error", function (err) { console.log("Error: " + err.message); });
/*rootSelf.on('css stream', function (css) {
    css.pipe(fs.createWriteStream('../server_statics/public/styles.css')); //rewrite the file with the new "abstract name"
});*/

exports.bundler = ()=>{
  appSign.pipe(fs.createWriteStream('./public/react/appSign.js'));
  appWithin.pipe(fs.createWriteStream('./public/react/appWithin.js'));
  appSelfFront.pipe(fs.createWriteStream('./public/react/appSelfFront.js'));
  appTerrace.pipe(fs.createWriteStream('./public/react/appTerrace.js'));
}
