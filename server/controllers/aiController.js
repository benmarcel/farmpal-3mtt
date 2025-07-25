import { GoogleGenerativeAI } from "@google/generative-ai";

// import multer from "multer";

import fs from "fs";

// Create uploads directory if it doesn't exist
const dir = "./uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const gemini = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });

// Route to handle AI requests
export const askAI = async (req, res) => {
  const { message } = req.body;
  try {
    if (!model) {
      return res.status(500).json({ error: "Model not found" });
    }

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const prompt = `
      You're a smart Nigerian farming assistant.
      Understand and respond in clear, simple English or Pidgin.
      Make sure your answers help small farmers directly.

      Farmer: ${message}
      You:
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ reply: response });
  } catch (err) {
    console.error("Gemini Error:", err.message);
    res.status(500).json({ error: "AI error" });
  }
};

export const aiDiagnosis = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded." });
  }

  const imagePath = req.file.path;

  try {
    const imageBuffer = fs.readFileSync(imagePath);

    if (!imageBuffer) {
      return res.status(400).json({ error: "Image file is empty." });
    }
    if (!model) {
      return res.status(500).json({ error: "Model not found" });
    }
    // ⏱ Start timer
    console.time("GeminiDiagnosis");

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: req.file.mimetype,
        },
      },
      "You are a crop disease expert. Diagnose this plant leaf and name the disease if any. Suggest treatment if possible.",
    ]);

    // ⏱ End timer and log duration
    console.timeEnd("GeminiDiagnosis");

    const text = result.response.text();

    res.status(200).json({ reply: text });

    fs.unlinkSync(imagePath); // cleanup
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Diagnosis failed" });
  }
};
