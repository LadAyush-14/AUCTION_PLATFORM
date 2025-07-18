import jwt from "jsonwebtoken";

export const generateToken = (user, message, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
     expiresIn: process.env.JWT_EXPIRE,
  });

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: false,            
      sameSite: "Lax",          
      path: "/",                
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    })
    .json({
      success: true,
      message,
      user,
    });
};
