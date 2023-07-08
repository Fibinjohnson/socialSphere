const express=require("express")
const router=express.Router();
const {verifyToken}=require("../middleware/auth")
const {getUser,getUserFriends,addRemoveFriend}=require("../controller/users")

router.get("/:id",verifyToken,getUser)
router.get("/:id/friends",verifyToken,getUserFriends)
router.patch("/:id/:friendId",verifyToken,addRemoveFriend)
module.exports=router;