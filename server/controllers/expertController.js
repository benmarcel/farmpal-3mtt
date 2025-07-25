// controllers/expertController.js
import Experts from "../models/experts.js";
import bcrypt from "bcryptjs";

export const registerExpert = async (req, res) => {
  try {
    const { name, phone, expertise, languages, password } = req.body;

    // Check if already exists
    const exists = await Experts.findOne({ phone });
    if (exists) return res.status(400).json({ message: "Phone number already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newExpert = new Experts({
      name,
      phone,
      expertise,
      languages,
      password: hashedPassword,
    });

    await newExpert.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration." });
  }
};
export default registerExpert;