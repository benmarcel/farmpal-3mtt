// src/pages/FarmPalHome.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FarmPalHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f6fdf7] flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-4xl font-bold text-green-700 mb-2">🌾 Welcome to FarmPal</h1>
      <p className="text-gray-600 text-center max-w-xl mb-8">
        Your smart assistant for agriculture. Connect with experts, manage your farm, and get real-time support.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Farmer Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-green-100">
          <h2 className="text-2xl font-semibold mb-2 text-green-800">👨‍🌾 I’m a Farmer</h2>
          <p className="text-gray-600 mb-4">Access tools, ask questions, and connect with extension officers.</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="border border-green-600 text-green-700 px-4 py-2 rounded-lg"
            >
              Register
            </button>
          </div>
        </div>

        {/* Extensionist Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-green-100">
          <h2 className="text-2xl font-semibold mb-2 text-green-800">👩‍🔬 I'm an Extensionist</h2>
          <p className="text-gray-600 mb-4">Help farmers with expert advice and field guidance.</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/expert-login')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/expert-register')}
              className="border border-green-600 text-green-700 px-4 py-2 rounded-lg"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmPalHome;
