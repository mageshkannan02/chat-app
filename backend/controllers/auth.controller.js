const cloudinary = require("../lib/cloudinary");
const  generateToken  = require("../lib/utils");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

 
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
 const signup= async(req, res) => {
  
  

   const {fullName,email,password}=req.body;
  
   
   
    try {
      if(!fullName.trim() || !email.trim() || !password.trim()){
         return res.status(400).json({message:"All feilds are required"})
      }
      

      if(  password.length<6){
         return res.status(400).json({message:"password must be greater than 6"})
      }

      const existsUser=await User.findOne({email})
      if(existsUser) return res.status(400).json({message:"Email already exists"})
      const salt=await bcrypt.genSalt(10)
      const hashedPassowrd=await bcrypt.hash(password,salt)
      const newUser=new User({
         fullName,
         email,
         password:hashedPassowrd
      })

      if(newUser){
        generateToken(newUser._id,res)

        await newUser.save();
        res.status(201).json({
          message:"new User created"
        })
      }

      else{
         return res.status(400).json({message:"Invalid user name"})
      }


    } catch (error) {
         console.log("error in signup controller",error .message);
         res.status(500).json({message:"Internal server Error"})
    }
 }
 // biome-ignore lint/suspicious/noExplicitAny: <explanation>
 const login= async(req, res) => {
    try {
       const {email,password}=req.body;
       const user= await User.findOne({email})
       if(!user){
         return res.status(400).json({message:"Invalid credentials"})
       }
          
          
          const isPaswordcorrect=await bcrypt.compare(password,user.password)
          if(!isPaswordcorrect){
            return res.status(400).json({message:"Invalid credentials"})
          }
          

          

          generateToken(user._id,res)
          res.status(200).json(user)  
        
       
       


      
    } catch (error) {
      console.log("error in login controller",error .message);
      res.status(500).json({message:"Internal server Error"})

    }
 }
 // biome-ignore lint/suspicious/noExplicitAny: <explanation>
 const logout=(req, res) => {
     try {
      res.cookie("jwt","",{maxAge:0})
      res.status(200).json({message:"Logged out successfully"})
     } catch (error) {
      console.log("error in logout controller",error.message);
      res.status(500).json({message:"Internal server Error"})

     }
 }





// biome-ignore lint/suspicious/noExplicitAny: <explanation>
 const updateProfile=async(req,res)=>{
     try {
      const {profilePic}=req.body;
     const userId= req.user._id
     
     if(!profilePic){
      return  res.status(400).json({message:"Profile pic is required"})
     }
  const uploadResponse=   await cloudinary.uploader.upload(profilePic)
  const updateduser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
  res.status(200).json(updateduser)
  console.log(updateduser);
  console.log(userId);
  

     } catch (error) {
      console.log("error in update profile",error .message);
      res.status(500).json({message:"Internal server Error"})
     }
}

 // biome-ignore lint/suspicious/noExplicitAny: <explanation>
 const checkAuth=(req,res)=>{
     try {
      res.status(200).json(req.user)

     } catch (error) {
      console.log("error in checkAuth controller",error .message);
      res.status(500).json({message:"Internal server Error"})
     }
}
module.exports={
  signup,login,logout,updateProfile,checkAuth
}
