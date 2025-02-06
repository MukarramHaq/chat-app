import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId:{
            type: mongoose.Schema.Types.ObjectId, // the data type for senderID
            ref: "User", // reference to the User model. meaning the sender is a User
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    {timestamps: true}
)

const Message = mongoose.model("Message", messageSchema);
export default Message;