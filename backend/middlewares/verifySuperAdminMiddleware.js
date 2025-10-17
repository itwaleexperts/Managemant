const jwt = require("jsonwebtoken")

exports.verifySuperAdmin=async(req , res , next)=>{
  try {
    const token=req.cookies.token
    if(!token)return res.status(400).json({message:"please provide token"})
      const decode=jwt.verify(token,process.env.SUPER_ADMIN_TOKEN)
    if(!decode) return res.status(400).json({message:"invalid token please provide valid token"})
      req.superAdmin.id = decode.id
    next()
  } catch (error) {
    console.log("verifySuperAdmin error is ==========>",error)
    res.status(500).json({message:error.message})
  }
}