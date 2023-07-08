const jwt=require("jsonwebtoken");
module.exports.verifyToken=async(req,res,next)=>{
    try{
        const token=req.header("authorization");
        if(!token){
           return res.status(403).json({msg:"access denied"})
    
        }
        if(token.startsWith("Bearer")){
             token=token.slice(7,token.length).trimLeft();
             console.log(token)
        }
        const verified=jwt.verify(token,process.env.SECRETCODEJWT)
        req.user=verified;
        next()
    }catch(err){
        res.status(500).json({err:err.message})
    }
   
}