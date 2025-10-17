const jwt = require("jsonwebtoken");

const verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token found, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
     console.log(" Server Loaded Secret:", process.env.ADMIN_JWT_SECRET);
console.log(token);
console.log(authHeader);


    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    req.adminId = decoded.id;
    next();
  } catch (err) {
    console.error("JWT verify error:", err);
    return res.status(401).json({ message: "asdfghj" });
  }
};

module.exports = verifyAdminToken;
