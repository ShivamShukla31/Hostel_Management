import {Problem} from "../models/problem.model.js";
import {asyncHandler} from "../middleware/asyncHandler.js";
import { STATUS } from "../utils/constants.js";

export const createProblem = asyncHandler(async (req, res) => {

    const problem = await Problem.create({
        student: req.user._id,
        hostel: req.body.hostel,
        title: req.body.title,
        description: req.body.description,
        department: req.body.department,
        problemImage: req.file ? req.file.path : null,
        status: STATUS.PENDING
    });

    res.status(201).json(problem);
});

export const approveProblem = asyncHandler(async (req, res) => {

    const problem = await Problem.findById(req.params.id);

    if (!problem) {
        res.status(404);
        throw new Error("Problem not found");
    }

    problem.status = STATUS.APPROVED;

    problem.history.push({
        action: "Approved by Rector",
        updatedBy: req.user._id
    });

    await problem.save();

    res.json(problem);
});


export const assignWorker = asyncHandler(async (req, res) => {

    const { workerId } = req.body;

    const problem = await Problem.findById(req.params.id);

    problem.assignedWorker = workerId;
    problem.status = STATUS.ASSIGNED;

    problem.history.push({
        action: "Assigned to Worker",
        updatedBy: req.user._id
    });

    await problem.save();

    res.json(problem);
});

export const updateStatus = asyncHandler(async (req, res) => {

    const { status } = req.body;
    const problem = req.problem; // from middleware

    problem.status = status;

    problem.history.push({
        action: `Status changed to ${status}`,
        updatedBy: req.user._id
    });

    await problem.save();

    res.json(problem);
});

export const getMyProblems = asyncHandler(async (req, res) => {

    const problems = await Problem.find({ student: req.user._id })
        .populate("assignedWorker", "name role");

    res.json(problems);
});

export const getAllProblems = asyncHandler(async (req, res) => {

    const problems = await Problem.find()
        .populate("student", "name email")
        .populate("assignedWorker", "name role")
        .sort({ createdAt: -1 });

    res.json(problems);
});