const {connectToDb}=require("../connection/connection")
const {ObjectId}=require("mongodb")
module.exports.postChat=async(req,res)=>{
    try{
       const messageDetails=req.body;
       const msg=messageDetails.message;
       const {fromId,toId}=req.params;
       const database=await connectToDb();
       const chat =database.collection('chats').insertOne({message:{text:msg},
        users:{from:new ObjectId(fromId),to:new ObjectId(toId)},
        sender:[new ObjectId(fromId)]})
       console.log(req.body,messageDetails)
       res.status(200).json({chat})
    }catch(error){
      res.status(500).json({err:error.message})
    }
}
module.exports.getChat=async(req,res)=>{
    try{
      const database=await connectToDb();
      const {fromId,toId}=req.params;
      console.log(req.params,'reqparams')
      const chat=await database.collection('chats').find({'users.from':new ObjectId(fromId),'users.to':new ObjectId(toId)}).toArray();
      console.log(chat,"chat details of all friend")
      res.status(200).json(chat);
    }catch(error){
        res.status(500).json({err:error.message})
    }
}