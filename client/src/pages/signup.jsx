import React, { useState, useEffect } from 'react'; // Import useEffect for error handling
import useAuth from '../context/useAuth'; 
import { useNavigate, Link } from 'react-router-dom';
import Alert from '../components/Alert'; // Adjust path as needed for your Alert component

const Signup = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        phone: '',
    });
    // State to manage the Alert component's visibility and content
    const [alertInfo, setAlertInfo] = useState(null); // { message: '', type: '' }
    const [passwordVisible, setPasswordVisible] = useState(false);

    const navigate = useNavigate();
    // Using the custom hook for authentication
    const { signup, loading, error } = useAuth();

    // Effect to display API errors from useAuth context via the Alert component
    useEffect(() => {
        if (error) {
            setAlertInfo({ message: error.message, type: 'error' });
        }
    }, [error]); // Depend on the error state from useAuth

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Validate email before submitting
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertInfo(null); // Clear previous alerts

        // Basic client-side validation for all fields
        if (!userData.name.trim() || !userData.email.trim() || !userData.password.trim() || !userData.address.trim() || !userData.phone.trim()) {
            setAlertInfo({ message: 'All fields are required.', type: 'error' });
            return;
        }

        if (!validateEmail(userData.email)) {
            setAlertInfo({ message: 'Please enter a valid email address.', type: 'error' });
            return;
        }

        // You might want to add password strength validation here too

        const result = await signup(userData);

        if (result.success) {
            setAlertInfo({ message: result.message || 'Signup successful! Redirecting...', type: 'success' });
            // Optionally clear form fields after successful signup
            setUserData({
                name: '',
                email: '',
                password: '',
                address: '',
                phone: '',
            });
            // Redirect after a short delay to allow user to see success message
            setTimeout(() => {
                navigate('/dashboard'); // Redirect to dashboard or login page
            }, 1500); // Redirect after 1.5 seconds
        } else {
            // If signup fails, useAuth's error state will be set,
            // and the useEffect above will display the error.
            // This fallback ensures a message even if useAuth's error isn't immediately caught.
            if (!error) { // Only set if useAuth hasn't already set its error
                setAlertInfo({ message: result.message || 'Signup failed. Please try again.', type: 'error' });
            }
        }
    };

    // Handler to clear the alert when it's closed by the user or auto-hides
    const handleCloseAlert = () => {
        setAlertInfo(null);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mt-16">
                <h2 className="text-3xl font-bold text-center mb-6 text-[var(--color-primary)]">
                    Create Your Account
                </h2>
                
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
                        <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name" 
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition duration-200"
                            placeholder="Your Name"
                            value={userData.name}
                            onChange={handleChange}
                            name="name"
                            required
                            autoComplete="name"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition duration-200"
                            placeholder="you@example.com"
                            value={userData.email}
                            onChange={handleChange}
                            name="email"
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition duration-200"
                            placeholder="••••••••"
                            value={userData.password}
                            name="password"
                            onChange={handleChange}
                            required
                            autoComplete="new-password" 
                        />
                        {/* Font Awesome icons for password visibility. Ensure Font Awesome is linked in your index.html */}
                        <i 
                            onClick={() => setPasswordVisible(!passwordVisible)} 
                            className={`cursor-pointer ${passwordVisible ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"} absolute right-3 top-[58%] transform -translate-y-1/2 text-gray-500 hover:text-gray-700`}
                        ></i>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition duration-200"
                            placeholder="(+234) 801 234 5678"
                            value={userData.phone}
                            name="phone"
                            onChange={handleChange}
                            required
                            autoComplete="tel"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-gray-700 text-sm font-semibold mb-2">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition duration-200"
                            placeholder="Farm Address, City, State"
                            value={userData.address}
                            name="address"
                            onChange={handleChange}
                            required
                            autoComplete="street-address"
                        />
                    </div>
                
                    <button
                        type="submit"
                        className="w-full bg-[var(--color-primary)] hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    <div className="text-center mt-6">
                        <Link to="/login" className="text-sm text-gray-600 hover:text-[var(--color-secondary)]">
                            Already have an account? Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
