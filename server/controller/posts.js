const {connectToDb}=require("../connection/connection")
const {collectionName}=require("../connection/collection")
const {ObjectId}=require("mongodb")

     module.exports.getFeedPosts=async(req,res)=>{
          try{
            const db=await connectToDb();
            const allPostsToFeed=await db.collection("posts").find().toArray();
            res.status(200).json(allPostsToFeed)
          }catch(err){
            res.status(404).json({message:err.message})
          }
    },
    module.exports.getUserPosts=async(req,res)=>{
        try{
            const {userId}=req.params;
            const db=await connectToDb();
            const userPosts=await db.collection(collectionName.postCollection).find({userId:new ObjectId(userId)}).toArray()
            res.status(200).json(userPosts)

        }catch{
            res.status(409).json({message:err.message})
        }
    },
    module.exports.likePost=async(req,res)=>{
        try{
            const {id}=req.params;
            const {userId}=req.body;
            console.log(id,userId,"params server")
            const database=await connectToDb();
            const removeResult = await database.collection(collectionName.postCollection).updateOne(
                { _id: new ObjectId(id), likes: new ObjectId(userId) },
                { $pull: { likes: new ObjectId(userId) } }
              );
              
              if (removeResult.modifiedCount === 0) {
                // Add userId to the likes array if it doesn't exist
                const addResult = await database.collection(collectionName.postCollection).updateOne(
                  { _id: new ObjectId(id), likes: { $ne: new ObjectId(userId) } },
                  { $addToSet: { likes: new ObjectId(userId) } }
                );
                
              }
              const updatedPost = await database.collection(collectionName.postCollection).findOne({ _id: new ObjectId(id) });
            
         res.status(200).json(updatedPost)
        }catch(err){
            res.status(409).json({message:err.message})
        }
    },
    module.exports.createPost=async(req,res)=>{
          try{
            const { userId,description,picturePath}=req.body;
            const db=await connectToDb();
            const user= await db.collection(collectionName.userCollection).findOne({_id:new ObjectId(userId)});
            const posts=await db.collection(collectionName.postCollection).insertOne({
                userId:new ObjectId(user._id),
                firstName:user.firstname,
                lastName:user.lastname,
                location:user.location,
                description:description,
                userPicturePath:user.picture,
                picturepath:picturePath,
                likes:[],
                comments:[]
            })
            const allPosts= await db.collection(collectionName.postCollection).find().toArray();
            res.status(200).json(allPosts)

          }
    catch(err){
    res.status(409).json({message:err.message})
    }


},
module.exports.commentPost=async(req,res)=>{
  try{
    const {postId}=req.params
    const {userId,commentposted}=req.body
    const body={userId:new ObjectId(userId),commentPosted:commentposted}
    console.log(body,"server body")
    const database=await connectToDb();
    const Posts=await database.collection("posts").updateOne({_id:new ObjectId(postId)},{$push:{comments:body}})
    const updatedPost=await database.collection('posts').aggregate([
      { $match: { _id: new ObjectId(postId) } },
      {
        $unwind: '$comments', // Unwind the comments array to separate each comment object
      },
      {
        $lookup: {
          from: 'users',
          localField:'comments.userId' ,
          foreignField:'_id' ,
          as: 'user',
        },
      },
      {
        $unwind: '$user', 
      },
      {
        $project: {
         _id:0,
          "comments.commentPosted": 1,
          "user.firstname": 1,
          "user.lastname": 1,
        },
      },
    ]).toArray();
     await database.collection("posts").updateOne({_id:new ObjectId(postId)},{$set:{allComments:updatedPost}})
    const updatedPosts=await database.collection('posts').findOne({_id:new ObjectId(postId)});
    
    res.status(200).json(updatedPosts)
    
   
  }catch(err){
    console.log("error occured during server comment",err.message);
    res.status(500).json(err.message)
  }


}

