import {Problem} from "../models/problem.model.js";
import { allowedTransitions } from "../utils/statusTransition.js";
import {asyncHandler} from "./asyncHandler.js";


export const validateStatusTransition = asyncHandler(async (req, res, next) => {

    const { status: newStatus } = req.body;

    const problem = await Problem.findById(req.params.id);

    if (!problem) {
        res.status(404);
        throw new Error("Problem not found");
    }

    const currentStatus = problem.status;

    const allowed = allowedTransitions[currentStatus];

    if (!allowed.includes(newStatus)) {
        res.status(400);
        throw new Error(
            `Cannot change status from ${currentStatus} to ${newStatus}`
        );
    }

    req.problem = problem; // attach for next controller
    next();
});