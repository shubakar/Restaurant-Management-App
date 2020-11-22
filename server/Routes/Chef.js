var express        = require("express");
var router         = express.Router();
var bodyParser = require("body-parser");
router.use( bodyParser.json() );
router.use(bodyParser.urlencoded({extended: true}));
router.use(require("express-session")({ 
	//Secret message used to Encode and Decode password
	secret:"shubakar",
	resave:false,
	saveUninitialized:false
}))

var User=require("../models/User");

var passport=require("passport");
var LocalStrategy=require("passport-local");
router.use(passport.initialize());
router.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

function ischefloggedin(req){
    if(req.isAuthenticated() && req.user.isChef && !req.user.isBlocked){
      return {
        loginstatus : true,
        username : req.user.username
      }
    }
    else{
      req.logOut();
      return { 
        loginstatus : false,
        username : ""
      }
    }
  }

router.post("/chef/signup",(req,res)=>{
    User.findOne({username:req.body.user.userName},async function(err,user){
            if(err){
                console.log(err);
            }
            else if(user===null){
                var newuser=new User({
                username : req.body.user.userName,
                address : req.body.user.address,
                phoneNo : req.body.user.phoneNo,
                isEmployee : false,
                isAdmin : false,
                isChef : true,
                isBlocked : false,
                myCart : [],
                myOrders : []
            });
            //Creating new User(save to database)
            const password=req.body.user.password;
            await User.register(newuser,password,function(err,user){
                if(err){
                    console.log(err);
                    res.send("error");
                }
                else{
                    res.send("success");
                }
            });
        }
        else{
            res.send("not unique user");
        }
    });
  })
  router.post("/chef/login",passport.authenticate("local",{
    //if password is verified-redirect to /index
    //successRedirect:"/employeeloginsuccessful",
    //if password or user is not registered or any error in Authentication -redirect to login form
    failureRedirect:"/employeeloginfailure"
  }),(req,res)=>{
    User.find({username : req.body.username},(err,user)=>{
      if(err){
        console.log(err);
        let verifyIsLoggedIn = {loginstatus : false, username : ""};
        req.logOut();
        res.send({isloggedin : verifyIsLoggedIn});
      }
      else{
        if(user[0].isChef){
          let verifyIsLoggedIn = {loginstatus : true, username : user[0].username};
          res.send({isloggedin : verifyIsLoggedIn});
        }
        else{
          let verifyIsLoggedIn = {loginstatus : false, username : ""};
          req.logOut();
          res.send({isloggedin : verifyIsLoggedIn});
        }
      }
    })
  }
  )
  router.get("/ischefloggedin",(req,res)=>{
    let verifyIsChefLoggedIn=ischefloggedin(req);
    res.send({isloggedin : verifyIsChefLoggedIn});
  })
  module.exports=router;