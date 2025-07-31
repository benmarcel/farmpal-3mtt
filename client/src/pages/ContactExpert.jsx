import  { useState} from "react";
import useFetch from '../hooks/useFetch'; 
 import Alert from '../components/Alert'; 
const CallExpertForm = () => {
  const [formData, setFormData] = useState({ topic: "", language: "" });
  const [experts, setExperts] = useState([]);
  const [alertInfo, setAlertInfo] = useState(null); // State for Alert component
  
 
  // Integrate the useFetch hook
  const { request, loading } = useFetch();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertInfo(null); // Clear previous alerts
    setExperts([]); // Clear previous experts
    // Basic client-side validation
    if (!formData.topic.trim() || !formData.language.trim()) {
      setAlertInfo({ message: 'Topic and Language are required.', type: 'error' });
      return;
    }
    
    try {
      // Use the request function from useFetch
      const res = await request("/contact", "POST", formData);
      setExperts(res.experts); // useFetch returns response.data directly
      setAlertInfo({ message: res.message || "Experts found! Click the link to message.", type: "success" });
      setFormData({ topic: "", language: "" }); // Reset form data
    } catch (err) {
      
      console.error("Error in CallExpertForm component:", err);
    
    }
  };

  const handleCloseAlert = () => {
    setAlertInfo(null);
  };

  return (
    <main className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg   w-full mt-10 space-y-8">
      <h1 className="text-4xl font-extrabold text-center text-green-700 mb-2 mt-6">Find Your Expert</h1>

      {/* Alert component for messages */}
      {alertInfo && (
        <div className="mb-6">
          <Alert
            message={alertInfo.message}
            type={alertInfo.type}
            onClose={handleCloseAlert}
            autoHideDuration={3000} // Alert will auto-hide after 3 seconds
          />
        </div>
      )}

      {/* Section 1: Contact Expert Form */}
      <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Search for an Expert</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic/Crop:</label>
            <input
              type="text"
              id="topic"
              placeholder="e.g., Maize, Marketing, Web Development"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 shadow-sm"
              aria-describedby="topic-help" // For accessibility
            />
            <p id="topic-help" className="text-xs text-gray-500 mt-1">Enter a specific topic or crop you need help with.</p>
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language:</label>
            <input
              type="text"
              id="language"
              placeholder="e.g., Yoruba, English, Spanish"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 shadow-sm"
              aria-describedby="language-help" // For accessibility
            />
            <p id="language-help" className="text-xs text-gray-500 mt-1">Enter the language you prefer for communication.</p>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Finding Experts...
              </>
            ) : (
              'Find Expert'
            )}
          </button>
        </form>
      </section>

      {/* Section 2: Expert Display - Conditionally rendered */}
      {(experts.length > 0 || loading) && (
        <section className="bg-white p-6 rounded-lg shadow-md border border-green-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Available Experts</h2>
          {loading ? (
            <div className="flex justify-center items-center h-48" role="status">
              <svg className="animate-spin h-8 w-8 text-green-600" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-3 text-gray-600">Searching for experts...</span>
            </div>
          ) : experts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No experts found matching your criteria.</p>
          ) : (
            <ul className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar" aria-live="polite">
              {experts.map((expert) => (
                <li
                  key={expert.id}
                  className="bg-green-50 p-4 rounded-lg shadow-md border border-green-200 flex flex-col sm:flex-row justify-between items-center gap-4"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-green-800">{expert.name}</h3>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Language(s):</span> {expert.languages.join(', ')}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Expertise:</span> {expert.expertise.join(', ')}
                    </p>
                  </div>
                  {expert.whatsappLink ? (
                    <a
                      href={expert.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 bg-green-600 text-white font-bold px-5 py-2 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md text-center"
                      aria-label={`Message ${expert.name} on WhatsApp`}
                    >
                      Message on WhatsApp
                    </a>
                  ) : (
                    <span className="text-red-500 text-sm text-center" aria-label="WhatsApp not available for this expert">WhatsApp not available</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

     
     
    </main>
  );
};

export default CallExpertForm;


