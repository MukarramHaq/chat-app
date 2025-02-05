import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body
    try {

        // Seeing if the password is correct and the user exists or not
        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        // checks if the fiels are filled or not
        if(!fullName || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({ message: "Email already exists!" });
        }

        //Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Creating the new user
        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })

        if(newUser){
            // generate jwt token here
            generateToken(newUser._id, res);
            await newUser.save(); // Saves the user to the db

            res.status(201).json({ //success message or smn has been created
                _id:newUser._id,
                fullName:newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })

        }else{
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password); // compares the passwords (rawPassword, passwordInDB);
        if(!isPasswordCorrect){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
        })
    } catch (error) {
        console.log("Error in login controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = (req, res) => {
    // just clear the cookies
    try {
        res.cookie("jwt", "", {maxAge:0}); // deletes the cookie
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        // to update profile image
        const {profilePic} = req.body; // extracting 'profilePic' from the request body
        // userId is important because it helps to identify which user's profile needs updating
        const userId = req.user._id; // Getting the user's ID from the request object

        if(!profilePic){
            return res.status(400).json({ message: "Profile pic is required" });
        }

        // if you have provided the picture it will be uploaded to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        // updates the user's profilePic in the DB fo the user
        const updatedUser = User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true});

        res.status(200).json(updatedUser)

    } catch (error) {
        console.log("Error in updateProfile: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}