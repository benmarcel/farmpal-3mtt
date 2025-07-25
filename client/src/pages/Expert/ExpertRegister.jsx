import React, { useState, useEffect } from 'react';
import useFetch from '../../hooks/useFetch'; 
import Alert from '../../components/Alert'; 
import { Link } from 'react-router-dom'; 

const ExpertRegister = () => {
    const [expertData, setExpertData] = useState({
        name: '',
        phone: '',
        password: '',
        expertise: '',
        languages: ''
    });

    const [alertInfo, setAlertInfo] = useState(null); 
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { request, loading, error } = useFetch();

    useEffect(() => {
        if (error) {
            setAlertInfo({ message: error.message, type: 'error' });
        }
    }, [error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpertData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertInfo(null);

        const { name, phone, password, expertise, languages } = expertData;

        if (!name || !phone || !password || !expertise || !languages) {
            setAlertInfo({ message: 'All fields are required.', type: 'error' });
            return;
        }

        try {
            const payload = {
                name,
                phone,
                password,
                expertise: expertise.split(',').map(e => e.trim()),
                languages: languages.split(',').map(l => l.trim())
            };

            const response = await request('/expert/register', 'POST', payload);

            setAlertInfo({ message: response.message || 'Expert registered successfully!', type: 'success' });

            setExpertData({
                name: '',
                phone: '',
                password: '',
                expertise: '',
                languages: ''
            });
        } catch (err) {
            console.error('Registration error:', err);
        }
    };

    const handleCloseAlert = () => setAlertInfo(null);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 mt-12 ">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mt-12">
                <h2 className="text-2xl font-bold text-center mb-6 text-green-600">Register as an Expert</h2>

                {alertInfo && (
                    <Alert
                        message={alertInfo.message}
                        type={alertInfo.type}
                        onClose={handleCloseAlert}
                        autoHideDuration={5000}
                    />
                )}

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={expertData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            required
                            className="w-full border rounded py-2 px-3 focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Phone Number (WhatsApp)</label>
                        <input
                            type="tel"
                            name="phone"
                            value={expertData.phone}
                            onChange={handleChange}
                            placeholder="2348012345678"
                            required
                            className="w-full border rounded py-2 px-3 focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            name="password"
                            value={expertData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            className="w-full border rounded py-2 px-3 focus:ring-2 focus:ring-green-500"
                        />
                        <i
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className={`cursor-pointer fa ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'} absolute right-3 top-[70%] transform -translate-y-1/2 text-gray-500`}
                        ></i>
                    </div>

                    {/* Expertise */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Area(s) of Expertise</label>
                        <input
                            type="text"
                            name="expertise"
                            value={expertData.expertise}
                            onChange={handleChange}
                            placeholder="e.g., Cassava, Poultry"
                            required
                            className="w-full border rounded py-2 px-3 focus:ring-2 focus:ring-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas.</p>
                    </div>

                    {/* Languages */}
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Language(s) Spoken</label>
                        <input
                            type="text"
                            name="languages"
                            value={expertData.languages}
                            onChange={handleChange}
                            placeholder="e.g., English, Yoruba"
                            required
                            className="w-full border rounded py-2 px-3 focus:ring-2 focus:ring-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                        {loading ? 'Registering...' : 'Register as Expert'}
                    </button>

                    {/* <div className="text-center mt-6">
                        <Link to="/login" className="text-sm text-gray-600 hover:text-green-500">
                            Already have an account? Login
                        </Link>
                    </div> */}
                </form>
            </div>
        </div>
    );
};

export default ExpertRegister;
