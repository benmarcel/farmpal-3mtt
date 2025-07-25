import jwt from "jsonwebtoken"
// import dotenv from "dotenv"
// dotenv.config()
const isAuthenticated = (req, res, next) =>{
    const authHeader = req.headers['authorization']; 
    try {
        const token = authHeader && authHeader.split(' ')[1] // split the header to get the token

        if (!token) {
            return res.status(401).json({message:"User is Unauthorized: No token provided."})
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
    if (err) {
      // Token is invalid or expired
      return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
    }
    // Token is valid, attach user payload to request
    req.user = user;
    next(); // Proceed to the next middleware/route handler
        })
    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error: error.message });
   
    }
}

export default isAuthenticated