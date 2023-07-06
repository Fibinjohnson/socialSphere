const {connectToDb}=require("../connection/connection")
const {collectionName}=require("../connection/collection")
const objectid=require("mongodb").ObjectId

     module.exports. getFeedPosts=async(req,res)=>{
          try{
            const db=await connectToDb();
            const allPosts=await db.collection(collectionName.postCollection).find().toArray()
            res.status(209).json(allPosts)
          }catch{
            res.status(404).json({message:err.message})
          }
    },
    module.exports.getUserPosts=async(req,res)=>{
        try{
            const {userId}=req.params;
            const db=await connectToDb();
            const userPosts=db.collection(collectionName.postCollection).find({userId:new objectid(userId)})
            res.status(200).json(userPosts)

        }catch{
            res.status(409).json({message:err.message})
        }
    },
    module.exports.likePost=async(req,res)=>{
        try{
            const {id}=req.params;
            const {userId}=req.body;
            const database=await connectToDb();
            const post= await database.collection(collectionName.postCollection).findOne({_id:new objectid(id)});
            const isLike=post.likes;
            /**  find liked if islike set delete else set userid */
            
         res.status(200).json()
        }catch{
            res.status(409).json({message:err.message})
        }
    },
    module.exports.createPost=async(req,res)=>{
          try{
            const { userId,description,picturePath}=req.body;
            const db=await connectToDb();
            const user= await db.collection(collectionName.userCollection).findOne({_id:new objectid(userId)});
            const posts=await db.collection(collectionName.postCollection).insertOne({
                userId:new objectid(user._id),
                firstName:user.firstName,
                lastName:user.lastname,
                location:user.location,
                description:description,
                userPicturePath:user.picturepath,
                picturepath:picturePath,
                likes:{
                    "likes":true
                },
                comments:[]
            })
            const allPosts=  db.collection(collectionName.postCollection).find().toArray();
            res.status(201).json({allPosts})

          }
    catch(err){
    res.status(409).json({message:err.message})
    }


}

