import express from 'express';
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import { connectDB } from './lib/db.js';
import cors from 'cors';

dotenv.config();
const app = express();

const PORT = process.env.PORT;

// middleware that parses the JSON string into a JavaScript object i.e, grabs the user data or the messages data.
app.use(express.json());
app.use(cookieParser()); // parses cookies

// This is a middleware that allows us to make requests from the frontend to the backend and gets rid of the cors error
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// Any routes defined in authRoutes will be prefixed with /api/auth
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    connectDB();
})