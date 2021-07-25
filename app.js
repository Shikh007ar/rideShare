const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const LocalStrategy = require('passport-local').Strategy;
const passport = require("passport");

mongoose.connect('mongodb://localhost:27017/rideShare', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: "shikhar",
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());

let foundPath;

app.get("/", function(request, response){
    response.render("main");
    });
app.get("/login", function(request, response){
    response.render("login");
    });
app.get("/register", function(request, response){
    response.render("register");
    });
    app.get("/portal", function(req, res){
        if(req.isAuthenticated()) 
             res.render("portal", );
        else res.redirect("/login");
      });

      


    const userDetail = new mongoose.Schema({
        name: String,
        lname: String,
        username: String,
        password: String,
        imagename: String
      });

      userDetail.plugin(passportLocalMongoose, {
        selectFields: 'username name lname imagename'
      });

      const Detail = new mongoose.model("Detail", userDetail);

      passport.use(Detail.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Detail.findById(id, function(err, user) {
    done(err, user);
  });
});


      const Storage = multer.diskStorage({
        destination: "./public/uploads/",
        filename: (req, file, cb) => {
          cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname));
        }
      });

      const upload = multer({ storage: Storage }).single("inpFile");

      

app.post("/register", upload,   function(req, res, next){
    Detail.register( new Detail({username: req.body.username, name: req.body.first, lname: req.body.last, imagename: req.file.filename}), req.body.password, function(err, detail){
      if(err){
        res.redirect("/register");
      }else{
        passport.authenticate("local")(req, res, function(){
          console.log("Registered");
          res.redirect("/portal");
        })
      }
    })
  });

  app.post("/login", function(req, res){

    const user = new Detail({
      username: req.body.username,
      password: req.body.password
    });
    req.login(user, function(err){
      if(err) console.log(err);
      else{
        passport.authenticate("local")(req, res, function(){
          console.log("Logged In");
            res.redirect("/portal");
        });
      }
    })
  });

app.listen(3000, function(){
    console.log("server is running on port 3000");
  })
  






