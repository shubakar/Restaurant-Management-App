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

var MenuItem=require("../models/MenuItem");
var User=require("../models/User");
var Order=require("../models/Orders");

var passport=require("passport");
var LocalStrategy=require("passport-local");
router.use(passport.initialize());
router.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

function isadminloggedin(req){
    if(req.isAuthenticated() && req.user.isAdmin){
      return{
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
  function isemployeeloggedin(req){
    if(req.isAuthenticated() && req.user.isEmployee && !req.user.isBlocked){
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

  function updateMenuItem(req){
    var title=req.body.menuItem.title;
    var subheader=req.body.menuItem.subheader;
    var image=req.body.menuItem.image;
    var description=req.body.menuItem.description;
    var cost=Number(req.body.menuItem.cost);
    var isAvailable=Boolean(req.body.menuItem.isAvailable);
    var updatedItem={
      "title" : title,
      "subheader" : subheader,
      "image" : image,
      "description" : description,
      "cost" : cost,
      "isAvailable" :  isAvailable
    }
    MenuItem.find({"title" : req.params.item},(err,item)=>{
      if(err){
        console.log(err);
      }
      else{
        MenuItem.findByIdAndUpdate(item[0]._id+"",updatedItem,(err,newitem)=>{
          if(err){
            console.log(err);
            res.send("error");
          }
          else{
            console.log("success");
          }
        })
      }
    })
  }

router.get("/admin/users",(req,res)=>{
    let verifyIsAdminLoggedIn=isadminloggedin(req);
    if(verifyIsAdminLoggedIn.loginstatus){
      User.find({isAdmin : false},(err,users)=>{
        if(err){
          console.log(err);
          req.logOut();
          res.send({users : [], isloggedin : {loginstatus : false, username : ""}});
        }
        else{
          res.send({users : users, isloggedin : verifyIsAdminLoggedIn});
        }
      })
    }
    else{
      req.logOut();
      res.send({users : [], isloggedin : {loginstatus : false, username : ""}});
    }
  })

  router.get("/admin/menu",(req,res)=>{
    let verifyIsEmployeeLoggedIn=isemployeeloggedin(req);
    if(verifyIsEmployeeLoggedIn.loginstatus){
      MenuItem.find({},(err,menu)=>
      {
        if(err){
          console.log(err);
        }
        else{
          res.send({response:menu, isloggedin : verifyIsEmployeeLoggedIn});
        }
      })
    }
    else{
      res.send({response  : [], isloggedin : verifyIsEmployeeLoggedIn});
    }
  })

  router.post("/admin/additemtomenu",(req,res)=>{
    let verifyIsAdminLoggedIn=isadminloggedin(req);
    if(verifyIsAdminLoggedIn.loginstatus){
      MenuItem.find({"title" : req.body.menuItem.title},(err,menuItems)=>{
        if(err){
          console.log(err);
          res.send("error");
        }
        else{
          if(menuItems.length===0){
            var title=req.body.menuItem.title;
            var subheader=req.body.menuItem.subheader;
            var image=req.body.menuItem.image;
            var description=req.body.menuItem.description;
            var cost=Number(req.body.menuItem.cost);
            var isAvailable=Boolean(req.body.menuItem.isAvailable);
            var newMenuItem={
              "title" : title,
              "subheader" : subheader,
              "image" : image,
              "description" : description,
              "cost" : cost,
              "isAvailable" :  isAvailable
            }
            MenuItem.create(newMenuItem,(err,retuned_menu_item)=>{
              if(err){
                console.log(err);
                res.send("error");
              }
              else{
                res.send("success");
              }
            })
          }
          else{
            res.send("not a unique title");
          }
        }
      })
    }
  })

  router.get("/admin/editmenuitem/:item",(req,res)=>{
    let verifyIsAdminLoggedIn=isadminloggedin(req);
    if(verifyIsAdminLoggedIn.loginstatus){
      MenuItem.find({"title" : req.params.item},(err,menuitem)=>{
        if(err){
          console.log(err);
        }
        else{
          res.send({response : menuitem, islogged : verifyIsAdminLoggedIn});
        }
      })
    }
    else{
      res.send({response : [], islogged : verifyIsAdminLoggedIn});
    }
  })

  router.put("/admin/editmenuitem/:item",(req,res)=>{
    let verifyIsAdminLoggedIn=isadminloggedin(req);
    if(verifyIsAdminLoggedIn.loginstatus){
      MenuItem.find({"title" : req.body.menuItem.title},(err,items)=>{
        if(err){
          console.log(err);
          res.send("error");
        }
        else{
          let len=items.length;
          if(len===0){
            res.send("success");
            updateMenuItem(req);
          }
          else if(len===1){
            MenuItem.find({"title" : req.params.item},(err,menuItem)=>{
              if(err){
                console.log(err);
                res.send("error");
              }
              else{
                let temp1=items[0]._id+"";
                let temp2=menuItem[0]._id+"";
                if(temp1==temp2){
                  res.send("success");
                  updateMenuItem(req);
                }
              }
            })
          }
        }
      })
    }
  })
  router.get("/admin/orders",(req,res)=>{
    let verifyIsAdminLoggedIn=isadminloggedin(req);
    if(verifyIsAdminLoggedIn.loginstatus){
      Order.find({},(err,orders)=>{
        if(err){
          req.logOut();
          res.send({orders : [], isloggedin : {loginstatus : false, username : ""}});
          console.log(err);
        }
        else{
          res.send({orders : orders, isloggedin : verifyIsAdminLoggedIn});
        }
      })
    }
    else{
      req.logOut();
      res.send({orders : [], isloggedin : verifyIsAdminLoggedIn});
    }
  })
  router.get("/admin/orders/:user",(req,res)=>{
    let verifyIsAdminLoggedIn=isadminloggedin(req);
    if(verifyIsAdminLoggedIn.loginstatus){
      User.findOne({username : req.params.user}).populate('myOrders').exec(function(err,orders){
        if(err){
          req.logOut();
          res.send({orders : [], isloggedin : {loginstatus : false, username : ""}});
          console.log(err);
        }
        else{
          res.send({orders : orders.myOrders, isloggedin : verifyIsAdminLoggedIn});
        }
      })
    }
    else{
      res.send({orders : [], isloggedin : verifyIsAdminLoggedIn});
    }
  })
  router.delete("/admin/delete/:item",async (req,res)=>{
    let verifyIsAdminLoggedIn=isadminloggedin(req);
    if(verifyIsAdminLoggedIn.loginstatus){
      await MenuItem.find({"title" : req.params.item},(err,menuItem)=>{
        if(err){
          console.log(err);
          res.send("error");
        }
        else{
          let id=menuItem[0]._id+"";
          MenuItem.findByIdAndRemove(id,(err)=>{
            if(err){
              console.log(err);
              res.send("error");
            }
          })
        }
      })
      res.send("Deleted");
    }
  })
  router.put("/admin/updateuserblockedstatus/:user",(req,res)=>{
    let verifyIsAdminLoggedIn=isadminloggedin(req);
    if(verifyIsAdminLoggedIn.loginstatus){
      User.find({username : req.params.user},async (err,user)=>{
        if(err){
          console.log(err);
        }
        else{
          let temp={isBlocked : !user[0].isBlocked};
           await User.findByIdAndUpdate(user[0]._id+"",temp,(err,updated)=>{
            if(err){
              console.log(err);
            }
            else{
              res.send("success");
            }
          })
        }
      })
    }
  })
  router.post("/admin/login",passport.authenticate("local",{
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
        if(user[0].isAdmin){
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
  router.get("/isadminloggedin",(req,res)=>{
    let verifyIsAdminLoggedIn=isadminloggedin(req);
    res.send({isloggedin : verifyIsAdminLoggedIn});
  })

module.exports=router;