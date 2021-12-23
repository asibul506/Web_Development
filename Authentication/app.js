//Finishing up : let user to submit secrets
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));

//Setting sessions (these lines must be placed here)
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

//Initializing passport and passport sessions(lines must be placed here after setting the sessions)
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String
});

//settign up userSchema using passport-local-mongoose as a plugin
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

//using passport-local-mongoose to create a local login strategy
passport.use(User.createStrategy());

//setting passport to serialize and deserialize user
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//Setting up google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //console.log(profile);
      return cb(err, user);
    });
  }
));


app.get("/", function(req, res){
  res.render("home");
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  });

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/secrets", function(req, res){
  User.find({"secret": {$ne:null}}, function(err, foundUsers){
    if(err){
      console.log(err);
    }else{
      if(foundUsers){
        res.render("secrets", {usersWithSecrets: foundUsers});
      }
    }
  });
});
app.get("/submit", function(req, res){
  if(req.isAuthenticated()){
    res.render("submit");
  }else{
    res.redirect("/login");
  }
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
})

app.post("/submit", function(req, res){
  const submittedSecret = req.body.secret;

  User.findById(req.user.id, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        foundUser.secret  = submittedSecret;
        foundUser.save(function(){
          res.redirect("/secrets");
        });
      }
    }
  });
});


app.post('/register', function(req, res){
  User.register({username: req.body.username}, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });
});

app.post('/login', function(req, res){
  const user = new User({
    username : req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });
});




app.listen(3000, function() {
  console.log("Server has started on port 3000");
});



/*
//Lavel 1 Authentication using email and password
app.post('/register', function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post('/login', function(req, res){
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email:userName}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});
*/


/*
//Lavel 2 Authentication: DataBase Encryption using Mongoose-Encryption (npm package)
//for Lavel 2
const encrypt = require("mongoose-encryption")


const secret = "ThisIsMySecretKey";
//These line must be added before the Schema
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });


app.post('/register', function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post('/login', function(req, res){
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email:userName}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});
*/


/*
//Level 2: Securing secret key using environment variable
require('dotenv').config();

//These line must be added after the Schema
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });


app.post('/register', function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post('/login', function(req, res){
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email:userName}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});

*/




/*
//Level 3: Hashing password
const md5 = require("md5");

app.post('/register', function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post('/login', function(req, res){
  const userName = req.body.username;
  const password = md5(req.body.password);

  User.findOne({email:userName}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});
*/

/*
//Level 4 : Hashing and Salting using bcrypt

const bcrypt = require("bcrypt");
const saltRounds = 10;


app.post('/register', function(req, res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.render("secrets");
      }
    });
  });
});

app.post('/login', function(req, res){
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email:userName}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if(result===true){
              res.render("secrets");
          }
        });
        }
      }
  });
});
*/



/*
//Level 5: using passport.js to add cookies and sessions

require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");

//Requireing the necessary packages for level 5
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));

//Setting sessions (these lines must be placed here)
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

//Initializing passport and passport sessions(lines must be placed here after setting the sessions)
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//settign up userSchema using passport-local-mongoose as a plugin
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

//using passport-local-mongoose to create a local login strategy
passport.use(User.createStrategy());

//setting passport to serialize and deserialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', function(req, res){
  res.render("home");
});

app.get('/login', function(req, res){
  res.render("login");
});

app.get('/register', function(req, res){
  res.render("register");
});

app.get("/secrets", function(req, res){
  if(req.isAuthenticated()){
    res.render("secrets");
  }else{
    res.redirect("/login");
  }
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
})


app.post('/register', function(req, res){
  User.register({username: req.body.username}, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });
});

app.post('/login', function(req, res){
  const user = new User({
    username : req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });
});




app.listen(3000, function() {
  console.log("Server has started on port 3000");
});
*/
