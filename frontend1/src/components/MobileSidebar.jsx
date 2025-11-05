import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Menu, X, Home, User, Trophy, Code2, FileText, 
    MessageSquare, Settings, Crown, LogOut, BarChart3,
    Calendar, Award, Target, Zap, TrendingUp
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../authSlice';
import { useNavigate } from 'react-router-dom';

const MobileSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Close sidebar when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleLogout = () => {
        dispatch(logoutUser());
        setIsOpen(false);
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    const navItems = [
        { path: '/home', label: 'Dashboard', icon: Home },
        { path: '/profile', label: 'My Profile', icon: User },
        { path: '/problems', label: 'Problems', icon: Code2 },
        { path: '/contests', label: 'Contests', icon: Trophy },
        { path: '/submissions', label: 'Submissions', icon: FileText },
        { path: '/discuss', label: 'Discuss', icon: MessageSquare },
        { path: '/leaderboard', label: 'Leaderboard', icon: TrendingUp },
    ];

    const settingsItems = [
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <>
            {/* Hamburger Button - Fixed at top left on mobile */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 lg:hidden bg-slate-800/90 backdrop-blur-md p-3 rounded-lg border border-slate-700 shadow-lg hover:bg-slate-700 transition-colors"
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle sidebar"
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <Menu className="w-6 h-6 text-white" />
                )}
            </motion.button>

            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 h-full w-72 bg-slate-900/95 backdrop-blur-md border-r border-slate-800 z-50 lg:hidden overflow-y-auto"
                    >
                        <div className="flex flex-col h-full">
                            {/* Header with User Info */}
                            <div className="p-6 border-b border-slate-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                        {user?.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold truncate">
                                            {user?.username || 'User'}
                                        </h3>
                                        {user?.isPremium && (
                                            <div className="flex items-center gap-1 text-yellow-400 text-xs">
                                                <Crown className="w-3 h-3" />
                                                <span>Premium</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-2 mt-3">
                                    <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                                        <div className="text-cyan-400 font-bold text-sm">0</div>
                                        <div className="text-slate-400 text-xs">Solved</div>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                                        <div className="text-emerald-400 font-bold text-sm">0</div>
                                        <div className="text-slate-400 text-xs">Streak</div>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                                        <div className="text-purple-400 font-bold text-sm">0</div>
                                        <div className="text-slate-400 text-xs">Rank</div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <nav className="flex-1 px-4 py-6 space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    
                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                                                ${isActive 
                                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                                                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                                }
                                            `}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeIndicator"
                                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"
                                                />
                                            )}
                                        </NavLink>
                                    );
                                })}

                                <div className="my-4 border-t border-slate-800" />

                                {settingsItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    
                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                                                ${isActive 
                                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                                                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                                }
                                            `}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </NavLink>
                                    );
                                })}
                            </nav>

                            {/* Footer with Logout */}
                            <div className="p-4 border-t border-slate-800">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200 border border-red-500/30"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar - Always visible on large screens */}
            <aside className="hidden lg:block fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-slate-900/50 backdrop-blur-md border-r border-slate-800 overflow-y-auto z-30">
                <div className="p-4">
                    {/* Desktop User Card */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 mb-6 border border-slate-700">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold">
                                {user?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-semibold text-sm truncate">
                                    {user?.username || 'User'}
                                </h4>
                                {user?.isPremium && (
                                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                                        <Crown className="w-3 h-3" />
                                        <span>Premium</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm
                                        ${isActive 
                                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            );
                        })}

                        <div className="my-3 border-t border-slate-800" />

                        {settingsItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm
                                        ${isActive 
                                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            );
                        })}

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200 border border-red-500/30 text-sm mt-3"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default MobileSidebar;
