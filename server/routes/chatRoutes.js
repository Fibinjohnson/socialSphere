const express=require("express");
const {verifyToken}=require("../middleware/auth")
const router=express.Router();
chatHelper=require("../controller/chats")
const {postChat,getChat}=chatHelper;


router.post('/:fromId/:toId',verifyToken,postChat)
router.get('/getChats/:fromId/:toId',verifyToken,getChat)
module.exports=router;