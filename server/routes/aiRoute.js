import express from 'express';
const router = express.Router();
import multer from 'multer';
// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });
import { askAI, aiDiagnosis  } from '../controllers/aiController.js';
router.post('/farmpal/ai/ask', askAI);
router.post('/farmpal/ai/diagnose', upload.single('image'), aiDiagnosis);

export default router;
// This route handles AI requests for asking questions and diagnosing crops.
// It uses the askAI and aiDiagnosis controllers to process the requests.