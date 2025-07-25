import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { get } from "mongoose";
const gemini = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });

const WEATHER_API_KEY = process.env.OPENWEATHER_KEY;

const getWeatherRecommendations = async (req, res) => {
  const { lat, lon } = req.body;
  const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${WEATHER_API_KEY}&units=metric`;

  try {
    const response = await axios.get(weatherUrl);
    const data = response.data;

    if (!data || !data.daily || data.daily.length === 0) {
      return res
        .status(404)
        .json({ message: "No weather data found for the specified location." });
    }
    const description = data.current.weather[0].description;
    const temp = data.current.temp;
    const humidity = data.current.humidity;
    if (!model) {
      return res.status(500).json({ error: "Model not found" });
    }
    const prompt = `As an AI farming advisor for Nigerian farmers, analyze the current weather: ${description}, ${temp}°C, ${humidity}% humidity. Provide 2-3 concise and actionable farming recommendations. For each recommendation, briefly explain its relevance to these specific weather conditions. Focus on practical aspects like planting, watering, or pest/disease management relevant to Nigerian agriculture.`;
    
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    // Return the weather data and AI response
    res.status(200).json({
      weather: description,
      temp,
      humidity,
      advice: aiResponse || "No advice available.",
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default getWeatherRecommendations;