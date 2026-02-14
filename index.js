import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import {errorHandler} from "./middleware/globalError.Middleware.js";
import connectDB from "./db/db.config.js";
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* Middlewares */
app.use(cors());
app.use(express.json());

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);

/* 404 Handler */
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

/* Error Handler */
app.use(errorHandler);

/* Start Server */
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
