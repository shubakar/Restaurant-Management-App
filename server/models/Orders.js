const mongoose = require('mongoose');
//Defining Order Schema
var orderSchema=new mongoose.Schema({
            bill : Number,
            deliveryCharge : Number,
            totalCost : Number,
            status : String,
            orderBy : String,
            deliverTo : String,
			items : [{
                title : String,
                noOfItems : Number
            }]
});
//Creating Order Schema
var Order=mongoose.model("Order", orderSchema);
//Exporting Order to other files
module.exports=Order;