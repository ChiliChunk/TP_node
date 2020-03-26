const fs = require("fs");
const express = require("express");
const port = 3000;
const bodyParser = require('body-parser')
const app = express();
const { uuid } = require('uuidv4');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const BASE_FILE = `{ "cities": [] }`;

app.get('/cities', (req, res) => {
  fs.readFile('cities.json', 'utf8', (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/html");
      res.end("Error, while reading file");
    }
    else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(data);
    }
  }, res)
})

app.post('/city', (req, res) => {
  res.setHeader("Content-Type", "text/html");
  if (!req.body.name) {
    res.statusCode = 500;
    res.end("Error, need to provide a name");
  }

  let fileContent;
  if (fs.existsSync('cities.json')) {
    fileContent = fs.readFileSync('cities.json', 'utf8');
  }
  else {
    fileContent = BASE_FILE;
  }
  
  let jsonContent = JSON.parse(fileContent);
  const sameCity = jsonContent["cities"].find(cityObj => cityObj.name === req.body.name);
  if (!sameCity) {
    jsonContent["cities"].push({ id: uuid(), name: req.body.name });
    const result = JSON.stringify(jsonContent);
    console.log(result);
    fs.writeFile('cities.json', result, 'utf8', function (err) {
      if (err) {
        res.statusCode = 500;
        res.end("Error during updating file");
      }
    }, res);
    res.statusCode = 200;
    res.end(result);
  }
  else {
    res.statusCode = 500;
    res.end('Error , city already present');
  }

})

app.put('/city', (req, res) => {
  res.setHeader("Content-Type", "text/html");
  if (!req.body.name || !req.body.id) {
    res.statusCode = 500;
    res.end("Error, need to provide a name and an id");
  }

  if (fs.existsSync('cities.json')) {
    const fileContent = fs.readFileSync('cities.json', 'utf8');
    let jsonContent = JSON.parse(fileContent);
    let cityToUpdate = jsonContent["cities"].find(cityObj => cityObj.id === req.body.id);
    if (cityToUpdate) {
      cityToUpdate.name = req.body.name;
      const result = JSON.stringify(jsonContent);
      fs.writeFile('cities.json', result, 'utf8', function (err) {
        if (err) {
          res.statusCode = 500;
          res.end("Error during updating file");
        }
      }, res);
      res.statusCode = 200;
      res.end(result);
    }
    else {
      res.statusCode = 500;
      res.end("Error , city to update not found");
    }
  }
  else {
    res.statusCode = 500;
    res.end("Error, cannot update the file (file not found)");
  }
})

app.delete('/city/:id', (req, res) => {
  res.setHeader("Content-Type", "text/html");
  if (!req.params.id) {
    res.statusCode = 500;
    res.end('Error, you need to provide an in in params');
  }
  if (fs.existsSync('cities.json')) {
    const fileContent = fs.readFileSync('cities.json', 'utf8');
    let jsonContent = JSON.parse(fileContent);
    let citiesToKeep = jsonContent["cities"].filter(cityObj => cityObj.id !== req.params.id);
    jsonContent["cities"] = citiesToKeep;
    console.log(jsonContent);
    const result = JSON.stringify(jsonContent);
    fs.writeFile('cities.json', result, 'utf8', function (err) {
      if (err) {
        res.statusCode = 500;
        res.end("Error during updating file");
      }
    }, res);
    res.statusCode = 200;
    res.end(result);
  }
  else {
    res.statusCode = 500;
    res.end("Error, cannot update the file (file not found)");
  }

})

app.listen(port, () => {
  console.log(`Server running on ${port} with express`);
})