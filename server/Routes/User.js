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

var passport=require("passport");
var LocalStrategy=require("passport-local");
router.use(passport.initialize());
router.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

function isloggedin(req){
    if(req.isAuthenticated() && !req.user.isBlocked){
      return {
        loginstatus : true,
        username : req.user.username
      }
    }
    else{
      req.logOut();
      return{
        loginstatus : false,
        username : ""
      }
    }
  }

router.get('/menu',(req,res)=>{
    MenuItem.find({"isAvailable" : true},(err,menu)=>{
      if(err){
        console.log(err);
      }
      else{
       let islogged=isloggedin(req);
        res.send({response:menu,isloggedin : islogged});
      }
    })
  })

router.get("/mycart",(req,res)=>{
    let verifyIsLoggedIn=isloggedin(req);
    if(verifyIsLoggedIn.loginstatus){
      let id=req.user._id+"";
      User.findById(id,(err,user)=>{
        if(err){
          console.log(err);
          res.send({myCart : [], isloggedin : verifyIsLoggedIn});
        }
        else{
          let myCart=user.myCart;
          res.send({myCart:myCart, isloggedin : verifyIsLoggedIn});
        }
      })
    }
    else{
      res.send({myCart : [], isloggedin : verifyIsLoggedIn});
    }
  });

  router.put("/mycart",(req,res)=>{
    var verifyIsLoggedIn=isloggedin(req);
    if(verifyIsLoggedIn.loginstatus){
      let id=req.user._id+"";
      let temp={
        myCart : req.body.myCart
      }
      User.findByIdAndUpdate(id, temp,(err,updatedUser)=>{
        if(err){
          console.log(err);
          res.send({status : "error"});
        }
        else{
          res.send({status : "success"});
        }
      })
    }
  });

  router.put("/additemtocart",(req,res)=>{
    let verifyIsLoggedIn=isloggedin(req);
    if(verifyIsLoggedIn.loginstatus){
      let id=req.user._id+"";
      User.findById(id,(err,user)=>{
        if(err){
          console.log(err);
        }
        else{
          let myCart=user.myCart;
          myCart.cost=Number(myCart.cost);
          myCart.noOfItems=Number(myCart.noOfItems);
          let len=myCart.length;
          let isItemUnique=true;
          for(let i=0;i<len;i++){
            if(myCart[i].title===req.body.item.title){
              isItemUnique=false;
              break;
            }
          }
          if(isItemUnique){
            myCart.push(req.body.item);
            let temp={
              myCart : myCart
            }
            User.findByIdAndUpdate(id,temp,(err,updatedUser)=>{
              if(err){
                console.log(err);
              }
            })
          }
        }
      })
    }
  })

  router.get("/myorders",(req,res)=>{
    let verifyIsLoggedIn=isloggedin(req);
    if(verifyIsLoggedIn.loginstatus===true){
      let id=req.user._id+"";
      User.findById(id).populate('myOrders').exec(function(err,orders){
        if(err){
          console.log(err);
        }
        else{
          res.send({orders : orders.myOrders, isloggedin : verifyIsLoggedIn});
        }
      })
    }
    else{
      res.send({isloggedin : verifyIsLoggedIn});
    }
  })

  router.post("/order",(req,res)=>{
    if(req.isAuthenticated()){
      var order={
        bill : Number(req.body.order.bill),
        deliveryCharge : Number(req.body.order.deliveryCharge),
        totalCost : Number(req.body.order.totalCost),
            items : [
                ]
      };
      let temp=req.body.order.items;
      let len=temp.length;
      for(let i=0;i<len;i++){
        order.items.push({title:temp[i].title, noOfItems : temp[i].noOfItems});
      }
      Order.create(order,(err,newOrder)=>{
        if(err){
          console.log(err);
          res.send("error");
        }
        else{
          let userid=req.user._id+"";
          let temp={
            myOrders : req.user.myOrders,
            myCart : []
          }
          temp.myOrders.push(newOrder._id+"");
          User.findByIdAndUpdate(userid, temp,(err,updatedUser)=>{
            if(err){
              console.log(err);
              res.send("error");
            }
            else{
              res.send("success");
            }
          })
        }
      })
    }
  })

  router.post("/signup",(req,res)=>{
    //Defining new user 
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
          isChef : false,
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
  
  router.get("/login",function(req,res){
    if(req.isAuthenticated()){
      res.send({status : true});
    }
    else{
      res.send({status : false});
    }
  })
  
  router.post("/login",passport.authenticate("local",{
    //if password is verified-redirect to /index
    successRedirect:"/loginsuccessful",
    //if password or user is not registered or any error in Authentication -redirect to login form
    failureRedirect:"/loginfailure"
    }),function(req,res){
      res.send(req.body);
  });
  router.get("/logout",(req,res)=>{
    req.logOut();
    res.send("logouted");
  })
  router.get("/isloggedin",(req,res)=>{
    const loginresponse=isloggedin(req);
    res.send({isloggedin : loginresponse});
  })
  router.get("/loginsuccessful",(req,res)=>{
    res.send({status : true,username : req.user.username});
  })
  router.get("/loginfailure",(req,res)=>{
    res.send({status : false, username : ""});
  })

module.exports=router;