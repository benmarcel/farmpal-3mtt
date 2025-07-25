// models/Expert.js
import mongoose from "mongoose";

const expertsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  expertise: [String],     // e.g., ["Cassava", "Poultry"]
  languages: [String],     // e.g., ["English", "Hausa"]
  available: { type: Boolean, default: true },
  password: { type: String, required: true }, // basic auth
});

export default mongoose.model("Expert", expertsSchema, "experts");
