const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  var num1 = Number(req.body.num1);
  var num2 = Number(req.body.num2);

  res.send("The result of the calculation is : "+(num1+num2));
});

app.get("/bmicalculator", function(req, res){
  res.sendFile(__dirname + "/bmi.html");
});

app.post("/bmicalculator", function(req, res){
  var weight = Number(req.body.weight);
  var height = Number(req.body.height);
  var bmi = weight/Math.pow(height,2);
  res.send("You BMI is : "+ bmi.toFixed(2));

});


app.listen(3000, function(){
  console.log("Server is running in port 3000");
});

// app.listen(3000);
