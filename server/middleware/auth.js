const jwt=require("jsonwebtoken");


module.exports.verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      console.log("token denied")
      return res.status(403).send("Access Denied");
      
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    
    }

    const verified = jwt.verify(token, process.env.SECRETCODEJWT);
    req.user = verified;
    console.log("token accessed")
    next();
  } catch (err) {
    res.status(500).json({ Tokenerror: err.message });
  }
};