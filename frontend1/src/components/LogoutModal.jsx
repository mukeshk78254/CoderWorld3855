import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, LogOut } from 'lucide-react';

const LogoutModal = ({ isOpen, onCancel, onConfirm, user }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style={{ 
                        position: 'fixed', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0,
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-lg"
                        onClick={onCancel}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(8px)'
                        }}
                    />
                    
                  
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="relative bg-slate-900/98 backdrop-blur-xl border border-slate-600 rounded-2xl shadow-2xl max-w-md w-full mx-4"
                        style={{ 
                            position: 'relative',
                            zIndex: 10000,
                            transform: 'translateZ(0)', 
                            margin: '0 auto',
                            maxWidth: '28rem',
                            width: '100%'
                        }}
                    >
                   
                        <div className="flex items-center justify-between p-6 border-b border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Confirm Sign Out</h3>
                                    <p className="text-sm text-slate-400">Are you sure you want to sign out?</p>
                                </div>
                            </div>
                            <button
                                onClick={onCancel}
                                className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                      
                        <div className="p-6">
                            <p className="text-slate-300 mb-6 text-center">
                                You will be signed out of your account and redirected to the login page. 
                                Any unsaved changes may be lost.
                            </p>
                            
                            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-lg font-bold text-white">
                                            {user?.firstname?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white text-lg">{user?.firstname || 'User'}</p>
                                        <p className="text-sm text-slate-400">{user?.emailId || 'user@example.com'}</p>
                                    </div>
                                </div>
                            </div>

                        
                            <div className="flex gap-3">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all font-semibold shadow-lg shadow-red-500/25"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <LogOut className="w-5 h-5" />
                                        Sign Out
                                    </div>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LogoutModal;
