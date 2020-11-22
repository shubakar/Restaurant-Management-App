const mongoose = require('mongoose');
var menuItemSchema=new mongoose.Schema({
    title : String,
    subheader : String,
    image : String,
    description : String,
    cost : Number,
    isAvailable : Boolean
});
var MenuItem=mongoose.model("MenuItem", menuItemSchema);
module.exports=MenuItem;