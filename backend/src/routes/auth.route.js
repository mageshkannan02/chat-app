
import { protectRoute}  from "../middleware/auth.middleware.js";

// router.js
import express from "express";
 const router = express.Router();
import {signup,login,logout ,checkAuth,updateProfile} from '../controllers/auth.controller.js'

// Define your routes here

router.post("/signup", signup)
 

 
router.post("/login",login)
 
 
router.post("/logout",logout)
router.put("/update-profile",protectRoute,updateProfile)

router.get("/check",protectRoute,checkAuth)
export default router;
 

