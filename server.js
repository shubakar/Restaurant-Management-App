const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;
const http=require("http");
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("express-session")({ 
	secret:"shubakar",
	resave:false,
	saveUninitialized:false
}))

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DataBase!'))
.catch(error => console.log(error.message));
const socketIO = require("socket.io");

var User=require("./server/models/User");
//Handel Authentaction
var passport=require("passport");
var LocalStrategy  = require("passport-local");
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

const io = socketIO(server);

var MenuItem=require("./server/models/MenuItem");
const Order = require('./server/models/Orders');
const { update } = require('./server/models/User');
var liveOrders=[];
io.on("connection", socket => {
  console.log("New client connected" + socket);
  socket.on("place_order",async (req)=>{
    var order={
      bill : Number(req.order.bill),
      deliveryCharge : Number(req.order.deliveryCharge),
      totalCost : Number(req.order.totalCost),
      status : "Order Received",
      orderBy : req.user.username,
      deliverTo : "",
		  items : [
              ]
    };
    await User.find({username : req.user.username},(err,user)=>{
      if(err){
        console.log(err);
        io.sockets.emit("order_response",{data : "error"});
      }
      else{
        if(!user[0].isEmployee){
          order.deliverTo=user[0].address;
        }
        else{
          order.deliverTo="In Restaurent";
        }
      }
    })
    let temp=req.order.items;
    let len=temp.length;
    var placedOrder;
    for(let i=0;i<len;i++){
      order.items.push({title:temp[i].title, noOfItems : temp[i].noOfItems});
    }
    Order.create(order,async (err,newOrder)=>{
      if(err){
        console.log(err);
        io.sockets.emit("order_response",{data : "error"});
      }
      else{
        var userid;
        var myOrders;
        await User.find({username : req.user.username},(err,user)=>{
          if(err){
            console.log(err);
            io.sockets.emit("order_response",{data : "error"});
          }
          else{
            userid=user[0]._id+"";
            myOrders=user[0].myOrders;
            placedOrder=newOrder;
          }
        })
        temp={
          myOrders : myOrders,
          myCart : []
        }
        temp.myOrders.push(newOrder._id+"");
        User.findByIdAndUpdate(userid, temp,(err,updatedUser)=>{
          if(err){
            console.log(err);
            io.sockets.emit("order_response",{data : "error"});
          }
          else{
            liveOrders.push(placedOrder);
            io.sockets.emit("live_orders",{liveOrders});
            socket.emit("order_response",{data : "success"});
          }
        })
      }
    })
  })
  socket.on("cancel_order", (req)=>{
    liveOrders=liveOrders.filter(item=>item._id!=req.orderid);
    io.sockets.emit("updated_orders",{liveOrders});
    Order.findById(req.orderid,(err, order)=>{
      if(err){
        console.log(err);
      }
      else{
        if(order.status==="Order Received"){
          Order.findByIdAndUpdate(req.orderid,{status : "cancelled"},(err,updatesUser)=>{
            if(err){
              console.log(err);
            }
          })
        }
      }
    })
  })
  socket.on("delivered", (req)=>{
    liveOrders=liveOrders.filter(item=>item._id!=req.orderid);
    io.sockets.emit("updated_orders",{liveOrders});
    Order.findById(req.orderid, (err,order)=>{
      if(err){
        console.log(err);
      }
      else{
        if(order.status==="Order Received"){
           Order.findByIdAndUpdate(req.orderid,{status : "Delivered"},(err,updatesUser)=>{
            if(err){
              console.log(err);
            }
          })
        }
      }
    })
  })
  socket.emit("live_orders",{liveOrders})
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  });

var userRouter = require("./server/Routes/User");
var adminRouter = require("./server/Routes/Admin");
var employeeRouter = require("./server/Routes/Employee");
var chefRouter = require("./server/Routes/Chef");

app.use(userRouter);
app.use(adminRouter);
app.use(employeeRouter);
app.use(chefRouter);

server.listen(port, () => console.log(`Listening on port ${port}`));