import express from "express";
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

// the protectRoute will make sure that when the user wants to update their profile
// that they are authenticated and logged in. protectRoute is our middleware
// that make sure the user is logged in.
router.put("/update-profile", protectRoute, updateProfile);

// This will check if the user is authenticated. If it is then we'll call checkAuth
// and if not we will not call checkAuth
router.get("/check", protectRoute, checkAuth);

export default router;