import express from "express";
import {
  createProblem,
  getMyProblems,
  getAllProblems,
  updateStatus,
  assignWorker
} from "../controllers/problemController.js";

import { protect } from "../middleware/auth.Middleware.js";
import { authorizeRoles } from "../middleware/role.Middleware.js";
import { upload } from "../middleware/imageUploader.Middleware.js";
import { validateStatusTransition } from "../middleware/validateStatusTransition.js";

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