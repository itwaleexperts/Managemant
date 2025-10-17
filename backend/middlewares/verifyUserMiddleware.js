const jwt = require("jsonwebtoken");

const verifyUserToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "No token found or token format invalid (Expected: Bearer <token>)" });
        }
        const token = authHeader.split(' ')[1];


        const decoded = jwt.verify(token, process.env.USER_TOKEN);

        req.user = decoded;
        req.userId = decoded.id; 

        next(); 

    } catch (error) {
        console.error("Token verification error:", error.message);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Token is invalid or corrupted" });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired" });
        }

        res.status(500).json({ message: "Authentication failed due to server error" });
    }
};

module.exports = verifyUserToken;