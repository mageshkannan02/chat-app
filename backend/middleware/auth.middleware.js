const jwt =require('jsonwebtoken') ;
const User =require('../models/user.model') ;
require("dotenv").config()


 

 const protectRoute =async(req,res,next)=>{
     try {
        const token=req.cookies.jwt
        if(!token){
            return res.status(401).json({
                message:
                "Unauthored — No Token Provided"})
            
        
     }

     const decoded=jwt.verify(token,process.env.JWT_SECRET)  

     if(!decoded){
        return res.status(400).json({message:"Invalid credentials"})
     }
  
     const user= await User.findById((decoded).userId).select("-password");
     
      
    
 
if(!user){
     res.status(404).json({message:"user not found"})
}

req.user=user;
next();

     } catch (error) {
         console.log("Error in protectedRoute middleware ",error.message);
         res.status(500).json({message:"Internal server Error"})
         
     }
}
module.exports = protectRoute;