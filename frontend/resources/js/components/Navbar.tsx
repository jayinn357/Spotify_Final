// resources/js/components/Navbar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const navLinks = [
        { name: "Home", href: user ? "/" : "/login" },
        { name: "Members", href: user ? "/members" : "/login" },
        { name: "About", href: "/about" },
        { name: "A'tInspired", href: user ? "/random-song" : "/login" },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSwitchAccount = async () => {
        await logout();
        navigate('/login');
    };  
    
    return (
    <nav className="bg-black/90 backdrop-blur-md text-white shadow-lg fixed w-full z-50">
            <div className="w-full px-6 py-3 flex items-center justify-between">
                {/* Logo */}
                            <Link to="/" className="flex items-center space-x-3 group" onClick={() => setMobileOpen(false)}>
                                <div className="h-12 w-12 rounded-full overflow-hidden">
                                    <img src="/images/system_logo2.png" alt="MAHALIMA Logo" className="h-full w-full object-cover" />
                                </div>
                                <span className="text-xl md:text-2xl font-extrabold tracking-wide text-yellow-400 group-hover:text-yellow-300 transition">MAHALIMA</span>
                            </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={`transition relative after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-yellow-400 after:transition-all hover:after:w-full
                                ${location.pathname === link.href ? "text-yellow-400 after:w-full" : "hover:text-yellow-300"}`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Authentication Section */}
                    {user ? (
                        <div className="relative border-l border-gray-700 pl-4">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center space-x-2 px-3 py-1 rounded-lg hover:bg-white/5 transition"
                                aria-expanded={profileOpen}
                                aria-haspopup="true"
                            >
                                <User className="w-5 h-5 text-yellow-400" />
                                <span className="text-sm text-gray-300">{user.name}</span>
                                <svg className="w-4 h-4 text-gray-300" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-2 z-50">
                                    <button
                                        onClick={handleSwitchAccount}
                                        className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-white/5"
                                    >
                                        Switch Account
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/5 flex items-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3 border-l border-gray-700 pl-4">
                            <Link 
                                to="/login"
                                className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition-colors duration-200"
                            >
                                Login
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Button */}
                <button
                    className="md:hidden text-yellow-400"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Dropdown */}
                {mobileOpen && (
                <div className="md:hidden bg-black/95 px-6 pb-4 space-y-2 border-t border-gray-800">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block py-2 hover:text-yellow-400 transition 
                                ${location.pathname === link.href ? "text-yellow-400" : ""}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    
                    {/* Mobile Authentication Section */}
                    {user ? (
                        <div className="pt-3 border-t border-gray-800 space-y-2">
                            <div className="flex items-center space-x-2 py-2">
                                <User className="w-5 h-5 text-yellow-400" />
                                <span className="text-sm text-gray-300">{user.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    onClick={handleSwitchAccount}
                                    className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-semibold transition-colors duration-200 w-full"
                                >
                                    Switch
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors duration-200 w-full"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="pt-3 border-t border-gray-800">
                            <Link 
                                to="/login"
                                className="block px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition-colors duration-200 text-center"
                            >
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
