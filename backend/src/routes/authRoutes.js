// src/routes/authRoutes.js
import express from "express";
import { authenticate } from "../controllers/authController.js";

const router = express.Router();

// ZKP-based authentication route
router.post("/authenticate", authenticate);

export default router;