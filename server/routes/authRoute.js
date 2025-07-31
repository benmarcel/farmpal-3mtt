import express from "express";
import {login} from "../controllers/authController.js";
import {signup} from "../controllers/authController.js";
import {userAuth} from "../controllers/authController.js"
import isAuthenticated from "../middleware/isAuthenticated.js";
const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/signup", signup);
router.get("/auth/me", isAuthenticated, userAuth);

export default router;
// This route handles user login requests.
// It uses the login controller to process the request and authenticate the user.
// The route listens for POST requests at the "/auth/login" endpoint.
