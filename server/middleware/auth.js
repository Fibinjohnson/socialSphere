const jwt=require("jsonwebtoken");
module.exports.verifyToken=async(req,res,next)=>{
    try{
        const token=req.header("authorization");
        console.log(token,"first token")
        if(!token){
            console.log("token not present")
           return res.status(403).json({msg:"access denied"})
         
    
        }
        if(token.startsWith("Bearer")){
            console.log(token,"token name")
             token=token.slice(7,token.length).trimLeft();
             console.log(token,"token name")
        }
        const verified=jwt.verify(token,process.env.SECRETCODEJWT)
        req.user=verified;
        next()
    }catch(err){
        res.status(500).json({err:err.message})
    }
   
}