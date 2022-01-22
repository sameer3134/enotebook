 const mongoose =require('mongoose');
 const mongoURI ="mongodb://localhost:27017/e-notebook?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
 const connectTomongo=()=>{
     mongoose.connect(mongoURI,()=>{
         console.log("connected to mongoose");
     })
 }
 module.exports= connectTomongo