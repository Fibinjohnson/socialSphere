const express=require("express");

const router=express.Router();
const postHelper=require('../controller/posts')
const {getFeedPosts,getUserPosts,likePost,commentPost}=postHelper
const {verifyToken}=require("../middleware/auth")

router.get("/",verifyToken,getFeedPosts)
router.get("/:userId/posts",verifyToken,getUserPosts)
router.patch('/:id/like',verifyToken,likePost)
router.patch("/:postId/comment",verifyToken,commentPost)


module.exports=router;