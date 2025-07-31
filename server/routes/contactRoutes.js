import express from "express";
import getMatchingExperts from "../controllers/contactController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
const router = express.Router();

router.post("/contact", isAuthenticated, getMatchingExperts);

export default router;
