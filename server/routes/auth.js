const express=require("express");
const router=express.Router()
const {login}=require("../controller/auth")
const {verifyToken}=require("../middleware/auth")



router.post("/login",login)
module.exports=router