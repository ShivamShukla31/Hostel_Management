import express from "express";
import {
  createProblem,
  getMyProblems,
  getAllProblems,
  updateStatus,
  assignWorker,
  getDashboardStats,
  getIssueStats,
  profile
} from "../controllers/problemController.js";

import { protect } from "../middleware/auth.Middleware.js";
import { authorizeRoles } from "../middleware/role.Middleware.js";
import { upload } from "../middleware/imageUploader.Middleware.js";
import { validateStatusTransition } from "../middleware/validateStatusTransition.js";
import { get } from "mongoose";

const router = express.Router();

/*
-----------------------------------------
Student Routes
-----------------------------------------
*/

// Create Problem
router.post(
  "/",
  protect,
  authorizeRoles("Student"),
  upload.single("problemImage"),
  createProblem
);

// Get My Problems
router.get(
  "/my",
  protect,
  authorizeRoles("Student"),
  getMyProblems
);

router.get(
  "/profile",
  protect,
  authorizeRoles("Student", "Worker", "Rector", "Warden"),
  profile
);

router.get(
  "/dashboard",
  protect,
  authorizeRoles("Student"),
  getDashboardStats
);

router.get(
  "/issue_stats",
  protect,
  authorizeRoles("Student"),
  getIssueStats
)

/*
-----------------------------------------
Rector / Warden Routes
-----------------------------------------
*/

// Get All Problems
router.get(
  "/",
  protect,
  authorizeRoles("Rector", "Warden"),
  getAllProblems
);

// Assign Worker
router.put(
  "/:id/assign",
  protect,
  authorizeRoles("Rector"),
  assignWorker
);

/*
-----------------------------------------
Worker / Status Update
-----------------------------------------
*/

router.put(
  "/:id/status",
  protect,
  authorizeRoles("Worker", "Rector"),
  validateStatusTransition,
  updateStatus
);

export default router;