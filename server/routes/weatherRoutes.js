import express from 'express';
const router = express.Router();
import getWeatherRecommendations from '../controllers/weatherController.js';

router.post('/farmpal/weather/recc', getWeatherRecommendations);

export default router;
// This route handles weather recommendations based on latitude and longitude.
// It uses the getWeatherRecommendations controller to process the request.
// The route listens for POST requests at the "farmpal/weather/recc" endpoint.
// It expects a request body containing latitude and longitude values to fetch weather data and provide farming advice.