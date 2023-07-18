const {connectToDb}=require("../connection/connection");
const {ObjectId}=require('mongodb')

module.exports.getUser = async (req, res) => {
  try {
      let database = await connectToDb();
      const { id } = req.params;

      // Validate the 'id' parameter
      if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: 'Invalid user ID format' });
      }

      const user = await database.collection('users').findOne({ _id: new ObjectId(id) });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
  } catch (err) {
      res.status(500).json({ userError: 'Error while fetching user data' });
      console.error(err, 'console user error');
  }
};
module.exports.getAllUsers=async(req,res)=>{
    try{
      const {id}=req.params
      console.log("Getting all users...");
     let database=await connectToDb();
     const allUsers=await database.collection("users").find().toArray();
     res.status(200).json(allUsers)
     console.log(allUsers,"all users in server")
    }catch(err){
      res.status(500).json({getAlluserError:err.message})
      console.log(err,"console getall user error")
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
    res.status(200).json(updatedUser)
    }catch(err){
        res.status(500).json({err:err.message})
    }
}