// controllers/expertController.js
import Expert from "../models/experts.js";

export const requestWhatsAppHelp = async (req, res) => {
  const { topic, language } = req.body;

  const expert = await Expert.findOne({
    expertise: { $in: [topic] },
    languages: { $in: [language] },
    available: true,
  });

  if (!expert) {
    return res.status(404).json({ message: "No expert available at the moment." });
  }

  // Create WhatsApp link
  const message = encodeURIComponent(`Hello, I am a farmer needing help with ${topic}.`);
  const waLink = `https://wa.me/${expert.phone}?text=${message}`;

  res.json({
    message: "Expert found!",
    expertName: expert.name,
    whatsappLink: waLink,
  });
};

export default requestWhatsAppHelp;
