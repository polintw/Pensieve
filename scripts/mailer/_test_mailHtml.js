/*
_test File
only used to test if MktEmail.js work well.
*/

const fs = require('fs');
const {_render_HtmlBody} = require('./MktEmail.js');

let mailUnitArr = [];
mailUnitArr.push(
  {
    unitExposed: "74fea6iac1i602i84fe",
    type: "responds",
    imgUrl: "1/1592394566409_layer_0.jpg",
    nodes: ["Taiwan"] // ["name of node"]
  }
);
mailUnitArr.push(
  {
    unitExposed: "d52440i8d2i091ia26f",
    type: "newResi",
    imgUrl: "26/1593604211020_layer_0.jpg",
    nodes: ["Taipei City", "Wenshan"] // ["name of node"]
  }
);

const mailDom = _render_HtmlBody(mailUnitArr);

fs.writeFile("./_testMailDom.html", mailDom, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
