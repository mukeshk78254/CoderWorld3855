import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';
import { useSelector } from 'react-redux';

const MigrationButton = ({ onMigrationComplete }) => {
    const { user } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleMigration = async () => {
        if (!user || !user.id) {
            setError('User not logged in');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axiosClient.post(`/api/migration/migrate-problems-solved/${user.id}`);
            console.log('✅ Migration successful:', response.data);
            setResult(response.data);
            
            // Callback to refresh dashboard data
            if (onMigrationComplete) {
                setTimeout(() => {
                    onMigrationComplete();
                }, 1500);
            }
        } catch (err) {
            console.error('❌ Migration failed:', err);
            setError(err.response?.data?.message || 'Migration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl border border-slate-700/50 p-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">Sync Problems Solved</h3>
                    <p className="text-sm text-slate-400">
                        Update your solved problems count from existing submissions
                    </p>
                </div>
                
                <button
                    onClick={handleMigration}
                    disabled={loading}
                    className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                        loading 
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                            : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                    }`}
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Syncing...' : 'Sync Now'}
                </button>
            </div>

            {/* Result message */}
            {result && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-start gap-2"
                >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-200">
                        <p className="font-semibold">Migration Successful!</p>
                        <p className="text-xs mt-1">
                            Found {result.uniqueProblems} unique problems from {result.totalSubmissions} submissions
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Error message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start gap-2"
                >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-200">
                        <p className="font-semibold">Migration Failed</p>
                        <p className="text-xs mt-1">{error}</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default MigrationButton;
