const express = require("express");
const app = express();
const mongoose = require("mongoose");
const place=require("./models/place.js")
const path =require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
const {placeSchema} = require("./schema.js");

const MONGO_URL="mongodb://127.0.0.1:27017/Hotel";

main().then(()=>{
    console.log("connected to db")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

}

app.engine("ejs",ejsMate)

app.set("views",path.join(__dirname,"views"));
app.set("views engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("hii , mai root hu");
});

const validatePlace=(req,res,next)=>{
    let {error}=placeSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
  
};
//index route
app.get("/place",wrapAsync(async(req,res)=>{
    const allPlace = await place.find({});
    res.render("places/index.ejs",{allPlace})
}));
//New route
app.get("/place/new",(req,res)=>{
    res.render("places/new.ejs")
});

//show route
app.get("/place/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const place3= await place.findById(id);
    res.render("places/show.ejs",{place3})
}))

//create route 
app.post("/place",validatePlace,wrapAsync(async(req,res,next)=>{
  
     
        const newPlace=new place(req.body.place);
       
        await newPlace.save();
        res.redirect("/place");
    
        
}))

//edit route

app.get("/place/:id/edit",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const place4 = await place.findById(id);
    res.render("places/edit.ejs",{place4})
}))
//update route
app.put("/place/:id",validatePlace,wrapAsync(async (req, res) => {
   
        let { id } = req.params;
        await place.findByIdAndUpdate(id, { ...req.body.place });
        console.log("Place updated successfully!");
        res.redirect(`/place/${id}`);

}));
//delete route

app.delete("/place/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const place6=await place.findByIdAndDelete(id);
   console.log(place6)
    res.redirect("/place")
}))

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
let {statusCode = 500,message="some error occured"}=err;
res.status(statusCode).render("places/error.ejs",{message})

});
app.listen(8080,()=>{
    console.log("hmara server 8080 chl gya h")
});


