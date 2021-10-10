const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");
const ejs = require("ejs");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})
const Article = mongoose.model("Article", articleSchema);


/////////////////////For All Articles//////////////////////////
app.route("/articles")
  .get(function(req,res){
    Article.find({},function(err, foundArticles){
      if(!err){
        res.send(foundArticles);
      }else{
        res.send(err);
      }
    })
  })
  .post(function(req,res){
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err){
      if(!err){
        res.send("Successfully added a new article!");
      } else{
        res.send(err);
      }
    });
  })
  .delete(function(req,res){
    Article.deleteMany(function(err){
      if(!err){
        res.send("Successfully deleted all the article");
      } else{
        res.send(err);
      }
    });
  });

/////////////////////For a specific Articles//////////////////////////

app.route("/articles/:articleTitle")
  .get(function(req,res){
    //If we want to pass a value of atricleTitle which has a space between it then we have to
    //use %20 instade of space. more information will be found on html url encoding
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if(foundArticle){
        res.send(foundArticle);
      }else{
        res.send("Article is missing");
      }
    });
  })

  .put(function(req, res){
    Article.updateOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      function(err){
        if(!err){
          res.send("Successfully updated");
        }else{
          res.send(err);
        }
      }
    );
  })

  .patch(function(req,res){
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successful");
        }else{
          res.send(err);
        }
      }
    );
  })

  .delete(function(req,res){
    Article.deleteOne({title: req.params.articleTitle},function(err){
      if(!err){
        res.send("Successfully deleted the article");
      }else{
        res.send("Faild to delete the article");
      }
    });
  });



app.listen(3000, function (){
  console.log("Server is running on port 3000");
});
