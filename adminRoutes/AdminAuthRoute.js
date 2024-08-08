const AdminAuthRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyAdmin = require("../middleware/verifyAdmin");
const Admin = require('../models/AdminModel')


AdminAuthRoute.post('/admin/register',   asyncHandler(async(req, res) => {
    const{email, password} = req.body

    if( !email || !password) res.json({msg: "fields cannot be blank"})




    const emailExists = await  Admin.findOne({ email });

    if (emailExists) {
      res.json({ msg: "The email exists, please user another one or login" });
    }

    
  
  const salt =  await bcrypt.genSalt(10);
  const hashedPassword = await  bcrypt.hash(password, salt);

   await Admin.create({
  
    email,
    password: hashedPassword
  })

  res.json({msg: "your account has been successfully created!"})



}))


AdminAuthRoute.post("/admin/login", asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const userExists = await Admin.findOne({ email }).select("+password");
    

    if (!userExists) {
      res.json({
        msg: "No user associated with this username exists in our system. Please register.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, userExists.password);

    if (passwordMatch) {
      
      let refreshtoken = createRefreshToken({id: userExists._id})

      res.cookie('refreshtoken', refreshtoken, { expire: new Date() + 9999 });

      jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_ADMIN, (err, admin) =>{
        if(err) return res.status(400).json({msg: "Please Login or Register"})
    
        const bmagtoken = createAccessToken({id: admin.id})
        
    
        res.json({bmagtoken}) })


      
    } else {
      res.json({ msg: "check your password again" });
    } 


    
}))


AdminAuthRoute.get('/admin/admin',verifyAdmin, asyncHandler(async(req, res) => {
  try{
    const admin = await Admin.findById(req.admin).select('-password')
    if(!admin) return res.status(400).json({msg: "this admin does not exist d does not exist."})
  
    res.json({admin})
  
  
  
  
  }
    catch(err) {
      return res.status(500).json({msg: err.message})
  
  
    }
  
  
  }))







const createAccessToken = (admin) =>{
    return jwt.sign(admin, process.env.ACCESS_TOKEN_ADMIN, {expiresIn: '7d'})
  }
  const createRefreshToken = (admin) =>{
    return jwt.sign(admin, process.env.REFRESH_TOKEN_ADMIN, {expiresIn: '7d'})
  }
  





module.exports = AdminAuthRoute
