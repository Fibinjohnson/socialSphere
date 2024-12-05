const {connectToDb}=require("../connection/connection");
const {ObjectId}=require('mongodb')
const {get_from_cache, add_to_cache}=require('./cache')

// const addAllUsersFromCache=async()=>{
//     let database=await connectToDb();
//     const allUsers=await database.collection("users").find().toArray();
//     await add_to_cache("add_all_users",allUsers)
// }

module.exports.getAllUsersFromCache = async () => {
    console.log("caleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    let cachedUsers = await get_from_cache("add_all_users");

    if (!cachedUsers) {
        let database = await connectToDb();
        cachedUsers = await database.collection("users").find().toArray();
        await add_to_cache("add_all_users", cachedUsers);  // Use cachedUsers, not allUsers
    }

    return cachedUsers;
};

// Exporting the function
// module.exports = { getAllUsersFromCache };