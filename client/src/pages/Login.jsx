import React, { useState, useEffect } from 'react'; // Import useEffect for auto-hide cleanup
import useAuth from '../context/useAuth'; 
import { useNavigate, Link } from 'react-router-dom';
import Alert from '../components/Alert'; // Adjust path as needed for your Alert component

function LoginPage() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State to manage the Alert component's visibility and content
  const [alertInfo, setAlertInfo] = useState(null); // { message: '', type: '' }
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Effect to display API errors from useAuth context via the Alert component
  useEffect(() => {
    if (error) {
      setAlertInfo({ message: error.message, type: 'error' });
    }
  }, [error]); // Depend on the error state from useAuth

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // Or any other protected route
    }
  }, [isAuthenticated, navigate]); // Depend on isAuthenticated and navigate

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertInfo(null); // Clear previous alerts

    if (!email || !password) {
      setAlertInfo({ message: 'Please enter both email and password.', type: 'error' });
      return;
    }
    if (!validateEmail(email)) {
      setAlertInfo({ message: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    const result = await login({ email, password });

    if (result.success) {
      setAlertInfo({ message: result.message, type: 'success' });
      // The useEffect for isAuthenticated will handle redirection
    } else {
      // If login fails, useAuth's error state will be set,
      // and the useEffect above will display the error.
      // This fallback ensures a message even if useAuth's error isn't immediately caught.
      if (!error) { // Only set if useAuth hasn't already set its error
        setAlertInfo({ message: result.message || 'Login failed. Please try again.', type: 'error' });
      }
    }
    // Reset form fields regardless of success or failure
    setEmail('');
    setPassword('');
  };

  // Handler to clear the alert when it's closed by the user or auto-hides
  const handleCloseAlert = () => {
    setAlertInfo(null);
  };

  // If already authenticated, the useEffect above handles navigation,
  // so we can return null or a simple message here to prevent rendering the form temporarily.
  if (isAuthenticated) {
    return null; 
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-[var(--color-primary)]"> {/* Using var for primary color */}
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Log in to your account
        </p>

        {/* Render the Alert component conditionally */}
        {alertInfo && (
          <div className="mb-4"> {/* Add some vertical margin around the alert */}
            <Alert
              message={alertInfo.message}
              type={alertInfo.type}
              onClose={handleCloseAlert}
              autoHideDuration={5000} // Alert will auto-hide after 5 seconds
            />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition duration-200" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition duration-200" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {/* Font Awesome icons for password visibility. Ensure Font Awesome is linked in your index.html */}
            <i 
              onClick={() => setPasswordVisible(!passwordVisible)} 
              className={`cursor-pointer ${passwordVisible ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"} absolute right-3 top-[45%] transform -translate-y-1/2 text-gray-500 hover:text-gray-700`}
            ></i>
            <Link to="/forgot-password" className="inline-block align-baseline font-bold text-sm text-[var(--color-primary)] hover:text-[var(--color-secondary)]"> 
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-primary)] hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-6">
         <Link to="/signup" className="text-sm text-gray-600 hover:text-[var(--color-secondary)]"> {/* Using var for secondary color */}
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
