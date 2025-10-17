const Admin=require("../models/adminModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require('dotenv').config();

const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,       
    pass: process.env.EMAIL_PASS,  
  },
});



exports.registerAdmin=async(req,res)=>{
  try {
    const {name,email,password}=req.body
    if(!name || !email || !password) return res.status(400).json({message:"name,email and password is required"})
      const admin=await Admin.findOne({email:email})
    if(admin) return res.status(400).json({message:"admin already register"})
   const hashPassword=await bcrypt.hash(password,10)
  const newAdmin=new Admin({
    name:name,
    email:email,
    password:hashPassword
  })
  const saveAdmin=await newAdmin.save()


 const mailOptions = {
      from: '"Super Admin" <youremail@gmail.com>', 
      to: email,                                   
      subject: "Admin Registration Successful",
      html: `
        <h3>Hello ${name},</h3>
        <p>You have been registered as an Admin by Super Admin.</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Password:</b> ${password}</p>
        <p>Please login to your dashboard using above credentials.</p>
      `,
    };





     try {
  let info = await transporter.sendMail(mailOptions);
} catch (err) {
}



  res.status(200).json({message:"admin register successfull!",data:saveAdmin})
  } catch (error) {
    console.log("registerAdmin error is =========>",error)
    res.status(500).json({message:error.message})
  }
}


exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not registered" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const payload = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    };

    const token = jwt.sign(payload, process.env.ADMIN_JWT_SECRET, { expiresIn: "100d" });

    res.status(200).json({ message: "Admin login successful!", token });
  } catch (error) {
    console.error("loginAdmin error:", error);
    res.status(500).json({ message: error.message });
  }
};



exports.getAllAdmins=async(req , res) => {
  try {
    const admin = await Admin.find()
    if(!admin) return res.status(400).json(admin)
      res.status(200).json(admin)
  } catch (error) {
    console.log("getAllAdmins error is ============>",error)
    res.status(500).json({message:error.message})
  }
}


exports.getOneAdmin=async(req , res)=>{
  try {
    const admin=await Admin.findById(req.params.adminId)
    if(!admin) return res.status(400).json({message:"admin not found"})
      res.status(200).json(admin)
  } catch (error) {
    console.log("getOneAdmin error is ============>",error)
    res.status(500).json({message:error.message})
  }
}


exports.updateAdmin=async(req,res)=>{
  try {
    const admin=await Admin.findByIdAndUpdate(req.params.adminId,req.body,{new:true})
    if(!admin) return res.status(400).json({message:"admin not found"})
      res.status(200).json({message:"admin update successfully",admin})
  } catch (error) {
    console.log("updateAdmin error is ==========>",error)
    res.status(500).json({message:error.message})
  }
}


exports.deleteAdmin=async(req ,res)=>{
  try {
    const admin=await Admin.findByIdAndDelete(req.params.adminId)
     if(!admin) return res.status(400).json({message:"admin not found"})
      res.status(200).json({message:"admin delete successfully",admin})
  } catch (error) {
    console.log("deleteAdmin error is ===========>",error)
    res.status(500).json({message:error.message})
  }
}