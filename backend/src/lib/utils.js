import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
 export const generateToken=(userId,res)=>{
    if(!process.env.JWT_SECRET){
        throw new Error("jwt secret is not defined")
    }

    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'1d'})

    res.cookie("jwt",token,{
           maxAge:2*24*60*60*1000,
           httpOnly:true,
           secure:process.env.NODE_ENV!=="development"
    })

    return token;

}
