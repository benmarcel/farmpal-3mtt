import express from "express";
import registerExpert from "../controllers/expertController.js";


const router = express.Router();


router.post("/expert/register", registerExpert);
        
export default router;
