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

    const verified = jwt.verify(token, "3802b4d810b37d10944ae36e735d17bacde4d694111320af862cebed73872486");
    console.log(verified,"verified")
    req.user = verified;
    
    next();
  } catch (err) {
    res.status(500).json({ Tokenerror: err.message });
  }
};