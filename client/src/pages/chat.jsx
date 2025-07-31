import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { marked } from 'marked'; // Ensure 'marked' is installed: npm install marked
// import useFetch from '../hooks/useFetch'; // Custom hook for API requests
// No need to import App.css anymore

function Chat() {
  const [messages, setMessages] = useState([]);
  const [typedQuestion, setTypedQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null); // Ref for scrolling
  const [currentSpeakingId, setCurrentSpeakingId] = useState(null); // To manage which message is speaking

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isLoading]); // Also scroll on loading state change

  const addMessage = (text, type) => {
    const newMessage = { id: Date.now(), text, type }; // Add a unique ID for key prop and speaking
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const showLoading = () => {
    setIsLoading(true);
  };

  const removeLoading = () => {
    setIsLoading(false);
  };

  const sendText = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const message = typedQuestion.trim();
    if (!message) return;

    addMessage(message, 'user');
    setTypedQuestion('');
    showLoading();

    try {
      const res = await axios.post(`${baseUrl}/farmpal/ai/ask`, { message });
      removeLoading();
      addMessage(res.data.reply, 'ai');
    } catch (err) {
      removeLoading();
      const errorMessage = err.response?.data?.error || 'Error getting response';
      addMessage(`❌ ${errorMessage}`, 'ai');
      console.error('Axios text error:', err);
    }
  };

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser does not support Web Speech API. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false; // Get final results

     // Indicate listening state
    recognition.start();

    recognition.onresult = (event) => {
      removeLoading(); // Remove "Listening..."
      const transcript = event.results[0][0].transcript;
      setTypedQuestion(transcript); // Set transcribed text to input field
      // Automatically send the transcribed text if desired, or let user hit send
      // sendText(new Event('submit')); // Programmatically trigger submit
    };

    recognition.onspeechend = () => {
      recognition.stop();
      removeLoading(); // Ensure loading is removed if speech ends without a result
    };

    recognition.onerror = (err) => {
      removeLoading();
      addMessage(`❌ Voice input error: ${err.error}`, 'ai');
      console.error('Voice error:', err);
    };

    recognition.onstart = () => {
      showLoading(); // Show loading spinner while listening
    };
  };

  const submitImage = async (e) => {
    const file = e.target.files[0];
    const MAX_SIZE_MB = 2;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    addMessage('Uploading photo for analysis...', 'user');
    showLoading();

    if (!file) {
      removeLoading();
      addMessage('Please upload a photo.', 'ai');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      removeLoading();
      addMessage(`Image too large! Max size is ${MAX_SIZE_MB}MB.`, 'ai');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${baseUrl}/farmpal/ai/diagnose`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status !== 200) throw new Error(`Server error (${res.status})`);

      const data = res.data;
      removeLoading();

      if (data?.reply) {
        addMessage(data.reply, 'ai');
      } else {
        addMessage('❌ Unexpected server response format.', 'ai');
      }
    } catch (err) {
      removeLoading();
      console.error('Image upload error:', err);
      addMessage(`❌ ${err.message || 'Diagnosis failed.'}`, 'ai');
    }
  };

  const speakMessage = (text, messageId) => {
    speechSynthesis.cancel(); // Stop any ongoing speech

    if (currentSpeakingId === messageId) {
      // If the same message is speaking, stop it
      setCurrentSpeakingId(null);
    } else {
      // Otherwise, start speaking this message
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'en-US';
      speechSynthesis.speak(speech);
      setCurrentSpeakingId(messageId);

      speech.onend = () => {
        setCurrentSpeakingId(null); // Reset when speech ends
      };
      speech.onerror = () => {
        setCurrentSpeakingId(null); // Reset on error
      };
    }
  };

  return (
    
    <div className="flex flex-col h-screen font-sans bg-gray-50"> 

      <main id="chat" ref={chatRef} className='p-4 overflow-y-auto flex-1 mt-20'> {/* chat container */}
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col"> {/* chat-message */}
            <div className={`max-w-[80%] p-3 my-2 rounded-2xl ${msg.type === 'user' ? 'self-end bg-green-100 text-green-800' : 'self-start bg-white text-gray-900 border border-gray-200'}`}> {/* bubble */}
              {msg.type === 'ai' ? (
                <>
                  <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }} />
                  <button
                    className="bg-transparent text-gray-700 hover:text-gray-900 ml-2 focus:outline-none" // speaker-btn
                    title={currentSpeakingId === msg.id ? "Stop Reading" : "Read Aloud"}
                    onClick={() => speakMessage(msg.text, msg.id)}
                  >
                    <i className={`fas ${currentSpeakingId === msg.id ? 'fa-stop' : 'fa-play'}`}></i>
                  </button>
                </>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col" id="loading-msg">
            <div className="max-w-[80%] p-3 my-2 rounded-2xl self-start bg-white text-gray-900 border border-gray-200"> {/* bubble ai */}
              <div className="w-5 h-5 border-2 border-gray-200 border-t-2 border-t-green-600 rounded-full animate-spin mx-auto my-2"></div> {/* spinner */}
            </div>
          </div>
        )}
      </main>

 <footer className="p-3 bg-white shadow-lg border-t border-gray-100 sm:border-t-0">
    {/* The main input bar container, centered and with max-w.
        We add flex-wrap here to allow items to stack if horizontal space runs out. */}
    <form id="chatInputForm" onSubmit={sendText}
          className="relative flex flex-wrap items-end w-full max-w-xl mx-auto bg-gray-50 border border-gray-200 rounded-3xl p-2.5
                     focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-all duration-200"
    >
        {/* Input field */}
        <input
            type="text"
            id="typedQuestion"
            placeholder="Ask your farming question..."
            value={typedQuestion}
            onChange={(e) => setTypedQuestion(e.target.value)}
            className="flex-1 p-2 rounded-2xl bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none
                       resize-none overflow-hidden h-auto max-h-40 min-w-0 sm:min-w-[200px]" // min-w-0 for small screens
        />

        {/* Action Buttons  */}
        <div className="flex gap-1.5 items-center pl-2 mt-2 sm:mt-0 ml-auto"> {/* flex gap for buttons */}
            {/* Voice Button */}
            <button
                type="button"
                id="voiceBtn"
                onClick={startVoice}
                className="flex items-center justify-center w-9 h-9 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                title="Voice Input"
            >
                <i className="fas fa-microphone text-lg"></i>
                <span className="sr-only">Voice Input</span>
            </button>

            {/* Image Input (hidden) */}
            <input
                type="file"
                id="imageInput"
                accept="image/*"
                className="hidden"
                onChange={submitImage}
            />
            {/* Image Trigger Button */}
            <button
                type="button"
                id="imageTriggerBtn"
                onClick={() => document.getElementById('imageInput').click()}
                className="flex items-center justify-center w-9 h-9 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                title="Upload Image"
            >
                <i className="fas fa-image text-lg"></i>
                <span className="sr-only">Upload Image</span>
            </button>

            {/* Send Button - more prominent */}
            <button
                type="submit"
                id="sendBtn"
                className="flex items-center justify-center w-9 h-9 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                title="Send Message"
            >
                <i className="fas fa-paper-plane text-lg"></i>
                <span className="sr-only">Send</span>
            </button>
        </div>
    </form>
</footer>
    </div>
  );
}

export default Chat;