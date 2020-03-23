const htpp = require("http");
const pug = require("pug");
const fs = require("fs");
const compiledFunction = pug.compileFile('template.pug');
const port = 3000;

const server = htpp.createServer((req, res) => {
  fs.readFile('data.csv', 'utf8', (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    else {
      const values = CSVToArray(data, ',');
      console.log(values)
      const generatedTemplate = compiledFunction({
        data : values
      });
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(generatedTemplate);
    }
  }, res)
})

server.listen(port, () => {
  console.log(`Server running on ${port}`);
})


function CSVToArray( strData, strDelimiter ){
  strDelimiter = (strDelimiter || ",");
  var objPattern = new RegExp(
      (
          "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
          "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
          "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
      );
  var arrData = [[]];
  var arrMatches = null;
  while (arrMatches = objPattern.exec( strData )){
      var strMatchedDelimiter = arrMatches[ 1 ];
      if (
          strMatchedDelimiter.length &&
          strMatchedDelimiter !== strDelimiter
          ){
          arrData.push( [] );
      }
      var strMatchedValue;
      if (arrMatches[ 2 ]){
          strMatchedValue = arrMatches[ 2 ].replace(
              new RegExp( "\"\"", "g" ),
              "\""
              );
      } else {
          strMatchedValue = arrMatches[ 3 ];
      }
      arrData[ arrData.length - 1 ].push( strMatchedValue );
  }
  return( arrData );
}