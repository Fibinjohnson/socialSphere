const {connectToDb}=require("../connection/connection");
const {ObjectId}=require('mongodb')
const {getAllUsersFromCache}=require('../cacheManager/cache.helpers')

module.exports.getUser = async (req, res) => {
  try {
      let database = await connectToDb();
      const { id } = req.params;

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
      const allUsers = await getAllUsersFromCache();
     res.status(200).json(allUsers)
    }catch(err){
      res.status(500).json({getAlluserError:err.message})
      console.log(err,"console getall user error")
    }
} 
module.exports.getUserFriends=async(req,res)=>{
    try{
        let database=await connectToDb()
        const {id}=req.params
        const friendsWithDetails = await database.collection("users").aggregate([
          {
            $match: { _id: new ObjectId(id) } 
          },
          {
            $lookup: {
              from: "users",
              localField: "friends", 
              foreignField: "_id",
              as: "friendsWithDetails" 
            }
          },
          {
            $unwind: "$friendsWithDetails" 
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
        res.status(500).json({ friendserr:err.message})
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
module.exports.searchFriends=async(req,res)=>{
  try{
    const searchQuery=req.query.q.trim()
    
let firstName, lastName;

const spaceIndex = searchQuery.indexOf(' ');
if (spaceIndex !== -1) {
  firstName = searchQuery.slice(0, spaceIndex);
  lastName = searchQuery.slice(spaceIndex + 1);
  const database=await connectToDb();
  const names = await database.collection('users').find({
   $and: [
     { firstname: {$regex:firstName,$options:'i'} },
     { lastname:  {$regex:lastName,$options:'i'}}
   ]
 }).toArray();
 console.log(names)                                                                          
res.status(200).json(names)
} else {
  firstName = searchQuery;
  const database=await connectToDb();
  const names = await database.collection('users').find({
    firstname: {$regex:firstName,$options:'i'}
  },
  {
    projection:{
      _id:1,
      firstname:1,
      lastname:1
    }
  }).toArray();                                                                             
res.status(200).json(names)   
}
    
  }catch(error){
    res.status(500).json({SearchError:error.message})
  }
}