const express = require("express");
const bodyParser = require("body-parser");
//Importing the module manually from date.js page
const date = require(__dirname + "/date.js");

const app = express();

let items = [];
let workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Creating home route
app.get("/", function(req, res) {
  const day = date.getDate(); //Assigning the imported data from the date.js page
  res.render("list", {
    listTitle: day,
    newListItems: items
  });
});

//Createing a post request
app.post("/", function(req, res) {
  let item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

//Creating Work route
app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  })
});

//About page Randering
app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server is running of port 3000");
});
