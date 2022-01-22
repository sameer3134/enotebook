const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Fetchuser = require('../middleware/Fetchuser');

const JWT_SECRET= 'Harryisagoodboy';
// routes1: create a User using: POST "/api/auth/createuser" no login required
router.post('/createuser',[
    body('name','enter a valid name').isLength({ min: 5 }),
    body('email','enter a valid email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req,res)=>{
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({success,error:"email alredy exists"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass= await bcrypt.hash(req.body.password, salt)
     user= await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })
    const data={
      user:{
        id: user.id
      }
    }
     const authtoken =jwt.sign(data,JWT_SECRET);
     success=true;
     res.json({success,authtoken})
    }catch(error){
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})
//routes2:  authenticate a User using: POST "/api/auth/login"
router.post('/login',[
  body('email','enter a valid email').isEmail(),
  body('password','Password not be blank').exists(),
], async (req,res)=>{
  let success=false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const{email,password}= req.body;
  try {
    let user= await User.findOne({email});
    if(!user){
      return res.status(400).json({success,error: "please try to login"});
    }
    const passwordCompare= await bcrypt.compare(password,user.password)
    if(!passwordCompare){
      
      return res.status(400).json({success , error: "please try to login"});
    }
    const data={
      user:{
        id: user.id
      }
    }
     const authtoken =jwt.sign(data,JWT_SECRET);
     success=true;
     res.json({success,authtoken})
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
})
//routes3:  get user logged in details  User using: POST "/api/auth/getuser"
router.post('/getuser',Fetchuser, async (req,res)=>{
try {
  userid=req.user.id
  const user = await User.findById(userid).select("-password")
  res.send(user)
} catch (error) {
  console.error(error.message);
  res.status(500).send("some error occured");
}
})

module.exports= router