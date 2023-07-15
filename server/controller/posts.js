const {connectToDb}=require("../connection/connection")
const {collectionName}=require("../connection/collection")
const {ObjectId}=require("mongodb")

     module.exports.getFeedPosts=async(req,res)=>{
          try{
            const db=await connectToDb();
            const allPostsToFeed=await db.collection("posts").find().toArray();
            console.log(allPostsToFeed,"allposts,db")
            res.status(200).json(allPostsToFeed)
          }catch(err){
            res.status(404).json({message:err.message})
          }
    },
    module.exports.getUserPosts=async(req,res)=>{
        try{
            const {userId}=req.params;
            const db=await connectToDb();
            const userPosts=db.collection(collectionName.postCollection).find({userId:new ObjectId(userId)})
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
                
                console.log(addResult, "addResult");
              }
              
              // Fetch the updated post
              const updatedPost = await database.collection(collectionName.postCollection).findOne({ _id: new ObjectId(id) });
              console.log(updatedPost, "updatedPost");
              
           
            console.log("server side",updatedPost)
            /**  find liked if islike set delete else set userid */
            
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
            console.log("createposts",allPosts)
            res.status(200).json(allPosts)

          }
    catch(err){
    res.status(409).json({message:err.message})
    }


}

