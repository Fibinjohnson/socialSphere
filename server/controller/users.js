const {connectToDb}=require("../connection/connection");
const {ObjectId}=require('mongodb')

module.exports.getUser=async(req,res)=>{
    try{
        let database=await connectToDb()
         const {id}=req.params;
         const users=  await database.collection("users").findOne({_id:new ObjectId(id)});
         console.log("server user:",users)
         res.status(200).json(users)
         
    }catch(err){
        res.status(500).json({usererr:err.message})
    }
}
module.exports.getUserFriends=async(req,res)=>{
    try{
        let database=await connectToDb()
        const {id}=req.params;
        const users=  database.collection("users").find({_id:new ObjectId(id)}).toArray()
        // const friends=await Promise.all(
        //     users.friends.map((id)=>{
        //         database.collection("users").find({_id:new ObjectId(id)}).toArray();
        //     })
        // )


        /* use aggregate to list the friends */
    }catch(err){
        res.status(500).json({err:err.message})
    }
}
module.exports.addRemoveFriend=async(req,res)=>{
    try{
    const {id,friendId}=req.params;
    let database=await connectToDb()
    const users=  database.collection("users").find({_id:new ObjectId(id)}).toArray();
    const friends=  database.collection("users").find({_id:new ObjectId(friendId)}).toArray();
    /**remove and add friends in friendlist */
    }catch(err){
        res.status(500).json({err:err.message})
    }
}