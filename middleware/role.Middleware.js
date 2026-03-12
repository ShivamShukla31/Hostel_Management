// middleware/roleMiddleware.js
import {ApiError} from "../utils/Api_Error.js";
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return new ApiError("Forbidden: You don't have permission to access this resource", 403);
        }
        next();
    };
};