const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placeSchema = new Schema({
title:{
    type:String,
    required:true,
},
description:{
type:String,
},
image:{
type:String,
default:"https://unsplash.com/photos/green-leaf-trees-near-beige-wooden-house-dLOt3xltXuc",
set:(v)=>v===""?"https://unsplash.com/photos/green-leaf-trees-near-beige-wooden-house-dLOt3xltXuc":v,
},
price:Number,
location:String,
country:String,
})

const Place=mongoose.model("Place",placeSchema);
module.exports = Place;