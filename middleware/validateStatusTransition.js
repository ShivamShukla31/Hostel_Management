import {Problem} from "../models/problem.model.js";
import { allowedTransitions } from "../utils/statusTransition.js";
import {asyncHandler} from "./asyncHandler.js";
import {ApiError} from "../utils/Api_Error.js";

export const validateStatusTransition = asyncHandler(async (req, res, next) => {

    const { status: newStatus } = req.body;

    const problem = await Problem.findById(req.params.id);

    if (!problem) {
        throw new ApiError("Problem not found", 404);
    }

    const currentStatus = problem.status;

    const allowed = allowedTransitions[currentStatus];

    if (!allowed.includes(newStatus)) {
        throw new ApiError(`Invalid status transition from ${currentStatus} to ${newStatus}`, 400);
    }

    req.problem = problem; // attach for next controller
    next();
});