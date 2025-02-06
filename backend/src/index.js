import express from 'express';
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import { connectDB } from './lib/db.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT;

// middleware that parses the JSON string into a JavaScript object i.e, grabs the user data or the messages data.
app.use(express.json());
app.use(cookieParser()); // parses cookies

// Any routes defined in authRoutes will be prefixed with /api/auth
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    connectDB();
})