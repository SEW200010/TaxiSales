import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (!userString) {
            navigate('/');
        } else {
            setUser(JSON.parse(userString));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) return null; 

    // Active path eka identify karaganna function eka
    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-zinc-900 text-zinc-100 font-sans">
            
            {/* Common Sidebar */}
            <aside className="w-72 bg-zinc-900 text-zinc-300 flex flex-col shadow-2xl border-r border-zinc-800">
                <div className="p-6 border-b border-zinc-800/80 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
                        TP
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-wider text-white">TAXI PRO</h2>
                        <p className="text-xs text-zinc-400 font-medium">Airport Management</p>
                    </div>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-1.5">
                    <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/dashboard') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'hover:bg-zinc-800 hover:text-white'}`}>
                        <span>Dashboard Overview</span>
                    </Link>
                    <Link to="#" className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 hover:text-white rounded-xl font-medium transition-all">
                        <span>Sales & Trips</span>
                    </Link>
                    <Link to="/companies" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/companies') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'hover:bg-zinc-800 hover:text-white'}`}>
                        <span>Companies Management</span>      
                    </Link>
                    {user.userType === 'admin' && (
                        <Link to="#" className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 hover:text-white rounded-xl font-medium transition-all">
                            <span>User Management</span>
                        </Link>
                    )}
                    <Link to="#" className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 hover:text-white rounded-xl font-medium transition-all">
                        <span>Reports & Analytics</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-zinc-800/80">
                    <button 
                        onClick={handleLogout}
                        className="w-full py-3 px-4 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white font-semibold rounded-xl transition-all border border-rose-500/20 flex items-center justify-center gap-2"
                    >
                        <span>Logout System</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 text-slate-800">
                
                {/* Common Header */}
                <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-xs">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Taxipro Portal</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Welcome back, {user.userName}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl">
                        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {user.shopName ? user.shopName.charAt(0) : 'U'}
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-slate-800">{user.userName}</p>
                            <p className="text-xs text-indigo-600 font-semibold capitalize">{user.shopName} • {user.userType}</p>
                        </div>
                    </div>
                </header>

                {/* Page Specific Content Goes Here */}
                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>

        </div>
    );
}