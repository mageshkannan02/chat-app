const cloudinary =require( "../lib/cloudinary");
const { getReceiverSocketId, io } = require("../lib/socket");
const Message =require("../models/message.model") ;
const User =require("../models/user.model") ;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const getUsersForSidebar=async(req,res)=>{
    try {
        const logedInUserId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:logedInUserId}}).select("-password")
        res.status(200).json(filteredUsers)


    } catch (error) {
        console.log("error in  getUsersForSidebar",error.message);
        res.status(500).json({message:"Internal server Error"})
    }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const getMessages=async(req,res)=>{
      try {
        const {id:userToChatId}=req.params
        const myId=req.user._id;
        const messages=await Message.find({
             $or:[
                {
                     senderId:myId,receiverId:userToChatId
                },
                {
                    senderId:userToChatId,receiverId:myId
                }
             ]
        })

        res.status(200).json(messages)
      } catch (error) {
        console.log("error in  getMessages",error.message);
        res.status(500).json({message:"Internal server Error"})
      }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const sendMessage=async(req,res)=>{
     try {
        const {text,image}=req.body;
      

        const {id:receiverId}=req.params;
        const senderId=req.user._id
        
        let imageUrl;
        if(image){
            const uploadedResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadedResponse.secure_url
        }
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        await  newMessage.save()
     
        

        
        const receiverSocketId=getReceiverSocketId(receiverId)
      
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage)

     } catch (error) {
        console.log("error in  sendMessage",error.message);
        res.status(500).json({message:"Internal server Error"})
     }

}


module.exports={getUsersForSidebar,getMessages,sendMessage}