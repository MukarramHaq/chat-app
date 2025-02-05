import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {

    // TO create a token
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:"7d"
    });

    // send JWT to cookies
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // This can only be in MS
        httpOnly: true, // prevents XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development"
    })

    return token;
}