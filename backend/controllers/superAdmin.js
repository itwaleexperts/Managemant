const jwt = require("jsonwebtoken");

// 🧠 Super Admin Login Controller
exports.loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ .env se Super Admin credentials le rahe hain
    const SUPER_EMAIL = process.env.SUPER_ADMIN_EMAIL;
    const SUPER_PASS = process.env.SUPER_ADMIN_PASSWORD;

    // ✅ Condition fix — sirf super admin hi login kar sake
    if (email !== SUPER_EMAIL || password !== SUPER_PASS) {
      return res.status(401).json({
        message: "Access denied: Only Super Admin can log in here.",
      });
    }

    // ✅ Super Admin object (password store nahi karte)
    const superAdminObject = {
      id: 1,
      email: SUPER_EMAIL,
      role: "superAdmin",
    };

    // ✅ Token generate
    const token = jwt.sign(superAdminObject, process.env.SUPER_ADMIN_TOKEN, {
      expiresIn: "100d",
    });

    // ✅ Cookie set + JSON response
    res
      .cookie("superAdminToken", token, {
        httpOnly: true,
        secure: false, // Production me true karna (HTTPS)
        maxAge: 100 * 24 * 60 * 60 * 1000, // 100 days
      })
      .status(200)
      .json({
        message: "Super Admin login successful!",
        token,
      });
  } catch (error) {
    console.log("loginSuperAdmin error =>", error);
    res.status(500).json({ message: error.message });
  }
};