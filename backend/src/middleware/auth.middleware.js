import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token  = req.cookies.jwt;

        if(!token){
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        // decoding the cookie using cookieParser so we can understand the cookie and grab the user ID
        // we need userID because that is what we put in the token.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // if the decoded is a false value
        if(!decoded){
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        // finds the user by the decoded userId in the database and excludes the password.
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        // if the user is authenticated, add the user to the request
        req.user = user;

        // this will call the next function in line
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}