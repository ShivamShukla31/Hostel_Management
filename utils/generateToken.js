import jwt from "jsonwebtoken";

const sign = (payload, secret, expiresIn) => 
  jwt.sign(payload, secret, { expiresIn });

export const generateAccessToken = (userId) =>
  sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET,
    process.env.JWT_ACCESS_EXPIRES_IN || "15m"
  );

export const generateRefreshToken = (userId) =>
  sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_EXPIRES_IN || "7d"
  );
