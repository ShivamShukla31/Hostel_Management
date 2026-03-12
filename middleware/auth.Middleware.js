// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import {ApiError} from "../utils/Api_Error.js";
export const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return new ApiError("Not authorized, no token", 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return new ApiError("User not found", 404);
        }

        req.user = user;

        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return new ApiError("Token expired", 401);
        }

        return new ApiError("Invalid token", 401);
    }
};