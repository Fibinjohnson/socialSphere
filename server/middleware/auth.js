const jwt=require("jsonwebtoken");


module.exports.verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
      console.log(token,"token")
    }

    const verified = jwt.verify(token, process.env.SECRETCODEJWT);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ Tokenerror: err.message });
  }
};