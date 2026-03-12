import express from "express";
import { registerUser, loginUser,refreshAccessToken, logout } from "../controllers/authController.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);

export default router;