import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import Alert from "../components/Alert";
import { marked } from 'marked'; 
const WeatherRec = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [alertInfo, setAlertInfo] = useState(null); // State to control the Alert component: { message: '', type: '' }

  // Destructure loading and error from useFetch

  const { request, loading, error: apiError } = useFetch();

  const fetchWeatherData = async () => {
    // Clear previous data and alerts before starting a new fetch
    setWeatherData(null);
    setAlertInfo(null);

    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      const geoErrorMessage = "Geolocation is not supported by your browser.";
      setAlertInfo({ message: geoErrorMessage, type: "error" });
      console.error(geoErrorMessage);
      return; // Exit if geolocation is not available
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Make the API request using the useFetch hook
          const data = await request("/farmpal/weather/recc", "POST", {
            lat: latitude,
            lon: longitude,
          });

          // Set the fetched weather data
          setWeatherData(data);
          // Show a success alert
          setAlertInfo({
            message: "Weather recommendations loaded successfully!",
            type: "success",
          });
        } catch (err) {
          // apiError is used for the alert, or a fallback message
          const errorMessage =
            apiError?.message ||
            "Failed to fetch weather data from the server.";
          setAlertInfo({ message: errorMessage, type: "error" });
          console.error("Error fetching weather data via useFetch:", err);
        }
      },
      (geoError) => {
        // Handle geolocation errors
        console.error("Geolocation error:", geoError);
        let errorMessage =
          "Error getting your location. Please ensure location services are enabled.";
        if (geoError.code === geoError.PERMISSION_DENIED) {
          errorMessage =
            "Location access denied. Please allow location access in your browser settings.";
        } else if (geoError.message) {
          errorMessage = geoError.message; // specific geolocation error message
        }
        setAlertInfo({ message: errorMessage, type: "error" });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    ); // Geolocation options
  };

  // useEffect to trigger data fetch when the component mounts
  useEffect(() => {
    fetchWeatherData();
  }, []); // Dependency array includes fetchWeatherData

  // Handler to clear the alert when it's closed by the user or auto-hides
  const handleCloseAlert = () => {
    setAlertInfo(null);
  };

  return (
    <div className="min-h-screen flex  justify-center bg-[#F7FDF2] p-4 mt-16">
      <div className="w-full  bg-white rounded-2xl shadow-lg p-4 space-y-6">
        <h2 className="text-2xl font-bold text-[#2E6206] text-center">
          🌾 Weather Recommendations
        </h2>

        <button
          onClick={fetchWeatherData}
          disabled={loading}
          className="w-full bg-[#2E6206] hover:bg-green-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Getting Recommendations..."
            : "Get Current Weather Advice"}
        </button>

        {/* Alert */}
        {alertInfo && (
          <div className="my-2">
            <Alert
              message={alertInfo.message}
              type={alertInfo.type}
              onClose={handleCloseAlert}
              autoHideDuration={5000}
            />
          </div>
        )}

        {/* Loading message */}
        {loading && !weatherData && !alertInfo && (
          <p className="text-center text-gray-600">
            ⏳ Loading weather data...
          </p>
        )}

        {/* Weather data display */}
        {weatherData && (
          <div className="bg-[#FFFDEB] border border-[#EFC217] p-4 rounded-xl space-y-2 ">
            <h3 className="text-xl font-semibold text-[#2E6206]">
              🌤️ Current Weather
            </h3>
            <p className="text-gray-800">
              Weather:{" "}
              <span className="font-medium">{weatherData.weather}</span>
            </p>
            <p className="text-gray-800">
              Temperature:{" "}
              <span className="font-medium">{weatherData.temp}°C</span>
            </p>
            <p className="text-gray-800">
              Humidity:{" "}
              <span className="font-medium">{weatherData.humidity}%</span>
            </p>

            <h3 className="text-xl font-semibold text-[#2E6206] mt-4">
              Recommendations
            </h3> <div className="text-gray-800 text-lg">
                        {/* <span className="text-2xl mr-2">🤖</span> */}
                        <span className="font-medium leading-relaxed" 
                              dangerouslySetInnerHTML={{ __html: marked.parse(weatherData.advice) }} 
                        />
                    </div>
          </div>
        )}

        {/* Initial instruction */}
        {!loading && !weatherData && !alertInfo && (
          <p className="text-center text-gray-600">
            Click the button to get current weather recommendations for your
            farm 🌾.
          </p>
        )}
      </div>
    </div>
  );
};

export default WeatherRec;
