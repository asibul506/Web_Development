const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-toDoList:test1234@cluster0.94wtq.mongodb.net/toDoList");


const itemsSchema = mongoose.Schema({
  name: String
})

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Welcome to our ToDoList!"
});

const defaultItems=[item1];

const listSchema = mongoose.Schema({
  name: String,
  items: [itemsSchema]
});
const List = mongoose.model("list", listSchema);

app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Successfully saved default items to database");
        }
      });
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  })
});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        //Creating a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
      }else{
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
      }
    }
  })
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
      name: itemName
    });
    if(listName==="Today"){
      item.save();
      res.redirect("/");
    }else{
      List.findOne({name: listName}, function(err, foundList){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+ listName);
      })
    }
});

app.post("/delete", function(req, res){
  const checkItemId = req.body.Checkbox;
  const listName = req.body.listName;

  if(listName==="Today"){
    Item.findByIdAndRemove(checkItemId, function(err){
      if(!err){
        console.log("Successfully deleted the checked item");
        res.redirect("/");
      }
    });
  }else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkItemId}}}, function(err, foundList){
      if(!err){
        res.redirect("/"+ listName);
      }
    });
  }
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
