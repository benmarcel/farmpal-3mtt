import express from "express";
import requestWhatsAppHelp from "../controllers/contactController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
const router = express.Router();

router.post("/contact", isAuthenticated, requestWhatsAppHelp);

export default router;
