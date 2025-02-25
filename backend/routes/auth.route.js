
const  protectRoute  =require( "../middleware/auth.middleware");

// router.js
const express = require('express');
const router = express.Router();
const {signup:signRoute,login:loginRoute,logout:logoutRoute ,checkAuth,updateProfile}  =require( '../controllers/auth.controller')

// Define your routes here

router.post("/signup", signRoute)
 

 
router.post("/login",loginRoute)
 
 
router.post("/logout",logoutRoute)
router.put("/update-profile",protectRoute,updateProfile)

router.get("/check",protectRoute,checkAuth)
 

module.exports=router// Export using braces
