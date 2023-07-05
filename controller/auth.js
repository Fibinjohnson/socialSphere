const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {connectToDb}=require("../connection/connection")
module.exports.register=async(req,res)=>{
    try{
        const {
            firstname,
            lastname,
            email,
            password,
            picturepath,
            friends,
            location,
            occupation}=req.body
            const salt=await bcrypt.genSalt();
            const passwordHash=bcrypt.hash(password, salt)
            const database=await connectToDb();

            newUser= await database.collection("users").insertOne({
                firstname,lastname,
                email,
                password:passwordHash,
                picturepath,
                friends,
                location,
                occupation,
                viewedprofile:Math.floor(math.random()*1000),
                impressions:math.floor(math.random()*1000)
                
            
            })
            res.status(201).json(newUser);
    }catch(err){
        res.status(500),json({error:err})
    }

},
module.exports.login=async(req,res)=>{
    try{
        const {
            email,password
        }=req.body;
        const database=await connectToDb();
        const user= await database.collection("users").findOne({email:email});
        if(!user){
           return  res.status(400).json({msg:"Email not found"})
        };
        const isMatch=bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({msg:"invalid Password"})
        }
        const token=jwt.sign({id:user._id},process.env.SECRETCODEJWT);
        const userWithoutPassword = { ...user, password: undefined };

        res.status(200).json({token,user:userWithoutPassword})
    }catch(err){
        res.status(500),json({error:err})
    }
    
}