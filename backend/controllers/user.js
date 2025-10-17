const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "name, email and password are required" });

    const user = await User.findOne({ email: email });
    if (user) return res.status(400).json({ message: "user already registered!" });

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      email: email,
      password: hashPassword
    });

    const saveUser = await newUser.save();
    res.status(200).json({ message: "user register successful!", data: saveUser });
  } catch (error) {
    console.log("registerUser error =============>", error);
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email and password are required" });

    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "user not registered" });

    const checkUser = await bcrypt.compare(password, user.password);
    if (!checkUser) return res.status(400).json({ message: "email and password are incorrect" });

    const userObject = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(userObject, process.env.USER_TOKEN, { expiresIn: "100d" });
    res.cookie("userToken", token);
    res.status(200).json({ message: "user login successful!", token: token });
  } catch (error) {
    console.log("loginUser error ============>", error);
    res.status(500).json({ message: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("userToken");
    return res.status(200).json({
      success: true,
      message: "Logout successful, cookie cleared!",
    });
  } catch (error) {
    console.log("logoutUser error ============>", error);
    res.status(500).json({ message: error.message });
  }
};


exports.userDetails = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "bookings",
        populate: [
          {
            path: "hotelId",
            select: "name city photos",
          },
          {
            path: "roomId",
            select: "type maxPeople price",
          },
        ],
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("userDetails error ===============>", error);
    res.status(500).json({ message: "Server error fetching user details." });
  }
};


exports.updateUser = async (req, res) => {
  const userId = req.userId;

  const { 
    name, 
    firstName = '', 
    lastName = '', 
    phone, 
    email, 
    receiveEmails 
  } = req.body;

  const fullName = name || [firstName, lastName].filter(Boolean).join(' ');

  const updateFields = {
    phone,
    email,
    receiveEmails
  };

  if (fullName && fullName.trim().length > 0 && fullName !== 'undefined undefined') {
    updateFields.name = fullName.trim();
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found or not authorized to update." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("updateUser error ===============>", error.message);
    res.status(500).json({ message: error.message });
  }
};
