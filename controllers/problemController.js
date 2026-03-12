import {Problem} from "../models/problem.model.js";
import {asyncHandler} from "../middleware/asyncHandler.js";
import { STATUS } from "../utils/constants.js";
import {ApiError} from "../utils/Api_Error.js";


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
        return new ApiError("Problem not found", 404);
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

export const profile = asyncHandler(async (req, res) => {

    const user = req.user;
    res.json({
        name: user.name,
        email: user.email,
        role: user.role
    });
});

export const getIssueStats = asyncHandler(async (req, res) => {

    const total = await Problem.countDocuments({ student: req.user._id });
    const pending = await Problem.countDocuments({ student: req.user._id, status: STATUS.PENDING });
    const approved = await Problem.countDocuments({ student: req.user._id, status: STATUS.APPROVED });
    const assigned = await Problem.countDocuments({ student: req.user._id, status: STATUS.ASSIGNED });
    const inProgress = await Problem.countDocuments({ student: req.user._id, status: STATUS.IN_PROGRESS });
    const completed = await Problem.countDocuments({ student: req.user._id, status: STATUS.COMPLETED });
    const closed = await Problem.countDocuments({ student: req.user._id, status: STATUS.CLOSED });

    res.json({
        total,
        pending,
        approved,
        assigned,
        inProgress,
        completed,
        closed
    });
});

export const getDashboardStats = asyncHandler(async (req, res) => { 
    const total = await Problem.countDocuments();
    const pending = await Problem.countDocuments({ status: STATUS.PENDING });
    const approved = await Problem.countDocuments({ status: STATUS.APPROVED });
    const assigned = await Problem.countDocuments({ status: STATUS.ASSIGNED });
    const inProgress = await Problem.countDocuments({ status: STATUS.IN_PROGRESS });
    const completed = await Problem.countDocuments({ status: STATUS.COMPLETED });
    const closed = await Problem.countDocuments({ status: STATUS.CLOSED });

    res.json({
        total,
        pending,    
        approved,
        assigned,
        inProgress,
        completed,
        closed
    });
});