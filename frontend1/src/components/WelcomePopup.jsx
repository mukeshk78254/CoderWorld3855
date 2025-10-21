import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Code, Trophy, Users } from 'lucide-react';

const WelcomePopup = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        
        if (!hasSeenWelcome) {
           
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1000);
            
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
      
        localStorage.setItem('hasSeenWelcome', 'true');
    };

    const getCurrentDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                   
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
                    >
                        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-cyan-500/30 overflow-hidden">
                           
                            <div className="absolute inset-0 overflow-hidden opacity-20">
                                <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
                                <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                            </div>

                          
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="relative z-10 p-8">
                              
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="flex justify-center mb-6"
                                >
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <Code size={40} className="text-white" />
                                        </div>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                            className="absolute -top-2 -right-2"
                                        >
                                            <Sparkles size={24} className="text-yellow-400" />
                                        </motion.div>
                                    </div>
                                </motion.div>

                               
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl font-bold text-center mb-2"
                                >
                                    <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        Welcome to CoderWorld!
                                    </span>
                                </motion.h2>

                              
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-center text-gray-400 text-sm mb-6"
                                >
                                    {getCurrentDate()}
                                </motion.p>

                              
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="space-y-4 mb-6"
                                >
                                    <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                                        <Code size={20} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-white font-semibold text-sm">500+ Coding Problems</h3>
                                            <p className="text-gray-400 text-xs">Practice and master algorithms</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                                        <Trophy size={20} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-white font-semibold text-sm">Weekly Contests</h3>
                                            <p className="text-gray-400 text-xs">Compete with developers worldwide</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                                        <Users size={20} className="text-purple-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-white font-semibold text-sm">Active Community</h3>
                                            <p className="text-gray-400 text-xs">Learn and grow together</p>
                                        </div>
                                    </div>
                                </motion.div>

                                
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    onClick={handleClose}
                                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-purple-500/30"
                                >
                                    Start Coding Now! 🚀
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default WelcomePopup;
