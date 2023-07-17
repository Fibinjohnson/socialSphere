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
        const friendsWithDetails = await database.collection("users").aggregate([
          {
            $match: { _id: new ObjectId(id) } // Match the user based on the provided _id.
          },
          {
            $lookup: {
              from: "users", // The name of the "users" collection.
              localField: "friends", // Assuming "friends" is an array of ObjectIds in the user document.
              foreignField: "_id",
              as: "friendsWithDetails" // The alias for the joined friends data.
            }
          },
          {
            $unwind: "$friendsWithDetails" // Unwind the friendsWithDetails array to create separate documents.
          },
          {
            $project: {
              _id: "$friendsWithDetails._id",
              firstname: "$friendsWithDetails.firstname",
              lastname: "$friendsWithDetails.lastname",
              picture: "$friendsWithDetails.picture",
              occupation: "$friendsWithDetails.occupation"
            }
          }
        ]).toArray();
        
        console.log(friendsWithDetails,"details");
        res.status(200).json(friendsWithDetails)
      
    }catch(err){
        res.status(500).json({err:err.message})
    }
}
module.exports.addRemoveFriend=async(req,res)=>{
    try{
    const {id,friendId}=req.params;
    let database=await connectToDb()
    const usersRemove=  await database.collection("users").updateOne({_id:new ObjectId(id),friends:new ObjectId(friendId)},
    {$pull:{friends:new ObjectId(friendId)}})
    if(usersRemove.modifiedCount===0){
    usersAdd=await database.collection("users").updateOne({_id:new ObjectId(id)},{$addToSet:{friends:new ObjectId(friendId)}})
    }
    updatedUser=await database.collection("users").aggregate([{$match:{_id:new ObjectId(id)}},
    {$project:{friends:1}},
    {$unwind:"$friends"},
    {
        $group: {
          _id: null,
          allFriends: { $addToSet: "$friends" } 
        }
      }]).toArray();
     console.log(updatedUser,"updatedUser")
    res.status(200).json(updatedUser)
    
    /**remove and add friends in friendlist */
    }catch(err){
        res.status(500).json({err:err.message})
    }
}