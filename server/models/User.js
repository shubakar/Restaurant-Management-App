const mongoose = require('mongoose');
//Importing passport-local-mongoose
//used to hide and work with password
var passportLocalMongoose=require("passport-local-mongoose");
//Declaring User model
var userSchema=new mongoose.Schema({
    address : String,
    phoneNo : String,
    isEmployee : Boolean,
    isAdmin : Boolean,
    isChef : Boolean,
    isBlocked : Boolean,
    myCart : [
        {
            title : String,
            subheader : String,
            image  : String,
            description : String,
            cost : Number,
            isAvailable : Boolean,
            noOfItems : Number
        }
    ],
    myOrders : [
        {
            type:mongoose.Types.ObjectId,
		    ref:"Order"
        }
    ]
});
userSchema.plugin(passportLocalMongoose);
//Creating User Schema
var User=mongoose.model("User", userSchema);
//Exporting Users to other files
module.exports=User;