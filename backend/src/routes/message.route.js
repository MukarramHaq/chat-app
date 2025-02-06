import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// To see the users on the sidebar
router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages); // The :id will be the id of the user that we want to fetch the messages with.

router.post("/send/:id", protectRoute, sendMessage); // the :id will be the id of the user that we want to send the message to

export default router;