const express = require("express");
const bodyParser=require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
  res.sendFile(__dirname +"/index.html");
});

app.post('/', function(req, res){
  var weight = Number(req.body.weight);
  var height = Number(req.body.height);
  var bmi = weight/Math.pow(height,2);
  var cmnt;
  if (bmi<18.5){
    cmnt="You are UnderWeight";
  }else if(bmi>=18.5 && bmi<=24.9){
    cmnt = "You are Normal";
  }else if(bmi>24.9){
    cmnt = "You are overWeight";
  }
  res.send("Your BMI is "+ bmi.toFixed(2)+"\n "+cmnt);
});

app.listen(3000, function(){
  console.log("Server is running on port 3000");
});
