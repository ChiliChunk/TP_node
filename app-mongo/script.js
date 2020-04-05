const fs = require("fs");
const express = require("express");
const port = 3000;
const bodyParser = require('body-parser')
const app = express();
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/cities" , {useNewUrlParser : true})
const db = mongoose.connection;

const citySchema = new mongoose.Schema({
    name : { type : String , unique : true, required : true}
})
const City = mongoose.model("City" , citySchema);
db.on("error", console.error.bind(console , "connection error : "));
db.once("open" , function(){
  console.log("db connected :D");
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/cities', (req, res) => {
  res.setHeader("Content-Type", "text/html");
  City.find((err , cities) =>{
    if(err) return console.error(err);
    res.end(JSON.stringify(cities));
  })
})

app.post('/city', (req, res) => {
  res.setHeader("Content-Type", "text/html");
  if (!req.body.name) {
    res.statusCode = 500;
    res.end("Error, need to provide a name");
  }
  console.log(req.body.name);
  const newCity = new City ({name : req.body.name})
  newCity.save((err)=>{
    if(err) console.error(err);
    City.find((err , cities) =>{
      if(err) return console.error(err);
      res.end(JSON.stringify(cities));
    })
  })

})

app.put('/city/:id', (req, res) => {
  res.setHeader("Content-Type", "text/html");
  if (!req.body.name) {
    res.statusCode = 500;
    res.end("Error, need to provide a name and an id");
  }

  City.findOneAndUpdate({_id: req.params.id}, {$set:{name:req.body.name}}, {new: true}, (err, updatedCity) => {
    if (err) {
        console.log("Something wrong when updating data!");
    }
    res.end(JSON.stringify(updatedCity));
  });
})

app.delete('/city/:id', (req, res) => {
  res.setHeader("Content-Type", "text/html");
  if (!req.params.id) {
    res.statusCode = 500;
    res.end('Error, you need to provide an in in params');
  }
  City.find({_id : req.params.id}).remove().exec();
  City.find((err , cities) =>{
    if(err) return console.error(err);
    res.end(JSON.stringify(cities));
  })

})

app.listen(port, () => {
  console.log(`Server running on ${port} with express`);
})