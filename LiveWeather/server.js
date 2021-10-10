/*
  This project is to get weather data from openweathermap.org and use in our website using their API
  1.  So after initializing the server now we need to sent a get request to the server of openweathermap.org.
      for that we are going to use the nodejs native module HTTPS to send the get request.

*/
const express = require('express');
const bodyParser = require('body-parser');
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  var city = req.body.city;
  console.log(city);

  // this will send a get request to the openweathermap.org with the url
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid=fefa8dd0d18f75c58ea15cf16d7378c5&units=metric";
  https.get(url, function(response){
    console.log(response.statusCode); //Optional just to check the status code

    //this will get the actual data receving from the url but it will get the data in json (but converted into hexadecimal)
    response.on("data", function(data){
      const weatherData = JSON.parse(data); //this code will convert the JSON file in to JS object
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      //We can not multiple response using the .send() method. so We have to use .write() method and send all the response using the .send() at the end
      res.write("<p >The weather is "+ description + "</p>");
      res.write("<h1>The temparature of " +city+ " is : "+ temp + " degree celcius</h1>");
      //Now I want to get the icon from the openweathermap.org and for that I have to use a endpoit from the server of openweathermap
      const iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<img src= " + iconUrl + ">");
      res.send();
   });
  });


});




app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
