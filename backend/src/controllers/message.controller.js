import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import Message from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne:loggedInUserId } }).select("-password"); // Find all the users but do not find the current users except the password

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id:userToChatId } = req.params;
        const myId = req.user._id; // the currently authenticated user i.e, me

        // find messages
        const messages = await Message.find({ 
            // The code block below will find messages for both the users.
            // the $or operator in MongoDB is used to find documents that match at least
            // one of the conditions in the array. The two conditions are below
            $or:[
                {senderId:myId, receiverId:userToChatId}, // I sent the messages.
                {senderId:userToChatId, receiverId:myId} // The other user sent the messages.
            ]
        })

         res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const {  id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if(image) {
            // Upload base64 to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // Creates a message
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save();

        // todo: realtime functionality goes here => socket.io

        // resource has been created. newMessage is sent back to client
        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}