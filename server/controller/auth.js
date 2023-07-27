const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {connectToDb}=require("../connection/connection");
const { ObjectId } = require("mongodb");
module.exports.register=async(req,res)=>{
    try{
        
        const {
            firstname,
            lastname,
            email,
            password,
            picture,
            location,
            occupation}=req.body
            console.log(req.body)
            
           const saltRounds = 10; // or choose an appropriate value
           const salt = await bcrypt.genSalt(saltRounds);
           const passwordHash = await bcrypt.hash(password, salt);
           const database = await connectToDb();


           const newUser = await database.collection("users").insertOne({
            firstname,
            lastname,
            email,
            password:passwordHash,
            picture,
            friends: [],
            location,
            occupation,
            viewedprofile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000)
          });
          console.log(newUser.insertedId.toString(),"newUser")
          
            res.status(200).json({newUser});
    }catch(err){
        console.log("error mongo,:",err )
        res.status(500).json({error:err})
       
    }

},
module.exports.editProfile=async(req,res)=>{
  try{
     const database= await connectToDb();
     const {userId}=req.params;
     console.log(req.body,'req')
     const updateQuery = {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          picture: req.body.picture,
        },
      };
      const result = await database.collection('users').updateOne({ _id: new ObjectId(userId) }, updateQuery);
      const post=await database.collection('posts').updateMany({userId: new ObjectId(userId)},{$set:{userPicturePath:req.body.picture}})
      const updatedUser = await database.collection('users').findOne({ _id: new ObjectId(userId) });
      res.status(200).json(updatedUser)
        
      
  }catch(err){
    res.status(500).json({editErr:err.message})
  }
},
module.exports.login=async(req,res)=>{
    try{
        console.log(req.body,"req,body")
        const {
            email,password
        }=req.body;
        const database=await connectToDb();
        const user= await database.collection("users").findOne({email:email});
       
        if(!user){
            console.log("email not found")
           return  res.status(400).json({msg:"Email not found"})
          
        };
        const isMatch= await bcrypt.compare(password,user.password);
        console.log(isMatch,"password match")
        
        if(!isMatch){
            console.log("not match ")
            return res.status(400).json({msg:"invalid Password"})
        }else{
           
            const token=jwt.sign({id:user._id},process.env.SECRETCODEJWT);
          
            const userWithoutPassword = { ...user, password: undefined };
            res.status(200).json({token,user:userWithoutPassword})
        }
       

        
    }catch(err){
        res.status(500).json({error:err})
        console.log("error of this code is:" ,  err)
    }
    
}