// controllers/expertController.js
import Expert from "../models/experts.js";

const getMatchingExperts = async (req, res) => {
  const { topic, language } = req.body;

  try {
    const query = { available: true };
    if (topic) query.expertise = { $in: [new RegExp(topic, 'i')] };
    if (language) query.languages = { $in: [new RegExp(language, 'i')] };

    const experts = await Expert.find(query).select('_id name languages expertise phone');

    if (!experts.length) {
      return res.status(404).json({ message: "No experts found matching your criteria." });
    }

    const expertsWithLinks = experts.map(expert => ({
      id: expert._id,
      name: expert.name,
      languages: expert.languages,
      expertise: expert.expertise,
      whatsappLink: expert.phone
        ? `https://wa.me/${expert.phone}?text=${encodeURIComponent(`Hello, I am a farmer needing help with ${topic || 'a general query'}.`)}`
        : null,
    }));

    res.json({ message: "Experts found!", experts: expertsWithLinks });
  } catch (error) {
    console.error("Error fetching experts:", error);
    res.status(500).json({ message: "Server error while fetching experts." });
  }
};

export default getMatchingExperts;
