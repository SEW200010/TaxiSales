import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); 

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                userName,
                password
            });
            
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/dashboard'); 
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Username or password is wrong');
            } else {
                setError('Server error');
            }
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center font-sans overflow-hidden">
            
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ 
                    backgroundImage: `url('http://googleusercontent.com/image_generation_content/435')` 
                }}
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
            </div>
            
            {/* Login Card Container */}
            <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-100 mx-4">
                
                {/* Brand / Title Header */}
                <div className="text-center mb-6">
                    <span className="inline-block p-3 bg-emerald-100 text-emerald-600 rounded-full mb-2 font-bold text-xl shadow-inner">
                        🚖
                    </span>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        TaxiSales Dashboard
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Sign in to manage your fleet and rides</p>
                </div>
                
                {/* Error Banner */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-md">
                        {error}
                    </div>
                )}
                
                {/* Login Form */}
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Username (Email)</label>
                        <input 
                            type="text" 
                            value={userName} 
                            onChange={(e) => setUserName(e.target.value)} 
                            placeholder="Enter your email"
                            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                            required 
                        />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Enter your password"
                            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full mt-3 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 text-sm tracking-wide"
                    >
                        Sign In
                    </button>

                </form>
            </div>
        </div>
    );
}
