import React, { useState} from "react";
import useFetch from '../hooks/useFetch'; // Adjust path to your useFetch hook
import Alert from '../components/Alert'; // Adjust path to your Alert component

const CallExpertForm = () => {
  const [formData, setFormData] = useState({ topic: "", language: "" });
  const [whatsappLink, setWhatsappLink] = useState(null);
  const [alertInfo, setAlertInfo] = useState(null); // State for Alert component

  // Integrate the useFetch hook
  const { request, loading } = useFetch();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertInfo(null); // Clear previous alerts
    setWhatsappLink(null); // Clear previous WhatsApp link
    // Basic client-side validation
    if (!formData.topic.trim() || !formData.language.trim()) {
      setAlertInfo({ message: 'Topic and Language are required.', type: 'error' });
      return;
    }
    
    try {
      // Use the request function from useFetch
      const res = await request("/contact", "POST", formData);
      setWhatsappLink(res.whatsappLink); // useFetch returns response.data directly
      setAlertInfo({ message: "Expert found! Click the link to message.", type: "success" });
      setFormData({ topic: "", language: "" }); // Reset form data
    } catch (err) {
      
      console.error("Error in CallExpertForm component:", err);
    
    }
  };

  const handleCloseAlert = () => {
    setAlertInfo(null);
  };

  return (
    <div className="p-4 border w-full max-w-md mx-auto  bg-white mt-26 flex flex-col justify-center">
      <h2 className="text-xl font-bold mb-4 text-green-700 text-center">Talk to an Expert</h2>

      {/* Alert component for messages */}
      {alertInfo && (
        <div className="mb-4">
          <Alert
            message={alertInfo.message}
            type={alertInfo.type}
            onClose={handleCloseAlert}
            autoHideDuration={5000} // Alert will auto-hide after 5 seconds
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Crop or Topic (e.g., Maize)"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3 transition duration-200"
          required
        />
        <input
          type="text"
          placeholder="Language (e.g., Yoruba)"
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
          className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4 transition duration-200"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading} // Disable button when loading
        >
          {loading ? 'Finding Expert...' : 'Find Expert'}
        </button>
      </form>

      {whatsappLink && (
        <div className="text-center mt-6">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-700 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-800 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Message Expert on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
};

export default CallExpertForm;


