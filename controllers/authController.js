// controllers/authController.js
import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import {asyncHandler} from "../middleware/asyncHandler.js";
import {generateAccessToken,generateRefreshToken} from "../utils/generateToken.js";
import RefreshTokenModel from "../models/refreshToken.model.js";
import { ApiError } from "../utils/Api_Error.js";
import jwt from "jsonwebtoken";

const msFromEnv = (input = "") => {
  const n = parseInt(input, 10);
  if (Number.isNaN(n)) return 0;
  if (input.endsWith("m")) return n * 60 * 1000;
  if (input.endsWith("h")) return n * 60 * 60 * 1000;
  if (input.endsWith("d")) return n * 24 * 60 * 60 * 1000;
  return n * 1000;
};

const storeRefreshToken = async (userId, token) => {
  const expiresAt = new Date(
    Date.now() + msFromEnv(process.env.JWT_REFRESH_EXPIRES_IN || "7d")
  );
  await RefreshToken.findOneAndUpdate(
    { user: userId },
    { token, expiresAt },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    throw new ApiError("Name, email, and password are required", 400);
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  await storeRefreshToken(user._id, refreshToken);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: msFromEnv(process.env.JWT_REFRESH_EXPIRES_IN || "7d")
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    accessToken
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError("Email and password required", 400);
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError("Invalid email or password", 401);
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  await storeRefreshToken(user._id, refreshToken);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: msFromEnv(process.env.JWT_REFRESH_EXPIRES_IN || "7d")
  });

  res.json({ accessToken });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) throw new ApiError("Refresh token required", 400);

  const saved = await RefreshToken.findOne({ token });
  if (!saved || saved.expiresAt < new Date()) {
    throw new ApiError("Invalid or expired refresh token", 403);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(payload.id);
    res.json({ accessToken });
  } catch {
    throw new ApiError("Invalid refresh token", 403);
  }
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (token) await RefreshToken.deleteOne({ token });

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});