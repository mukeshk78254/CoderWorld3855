import { motion } from 'framer-motion';
import { CheckCircle, Award } from 'lucide-react';

const ProblemsSolvedSummary = ({ stats }) => {
    const { 
        solvedCount = 0,
        easyCount = 0,
        mediumCount = 0,
        hardCount = 0,
        totalStats = { easy: 0, medium: 0, hard: 0 }
    } = stats || {};

    const totalProblems = totalStats.easy + totalStats.medium + totalStats.hard;
    const progressPercentage = totalProblems > 0 ? (solvedCount / totalProblems) * 100 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-xl"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <CheckCircle className="text-cyan-400" size={28} />
                    Unique Problems Solved
                </h2>
                <div className="text-4xl font-black text-cyan-400">
                    {solvedCount}
                </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Progress</span>
                    <span>{solvedCount} / {totalProblems} ({progressPercentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    />
                </div>
            </div>

            {/* Difficulty breakdown */}
            <div className="grid grid-cols-3 gap-4">
                {/* Easy */}
                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center"
                >
                    <div className="text-green-400 text-sm font-semibold mb-1">Easy</div>
                    <div className="text-3xl font-black text-white">{easyCount}</div>
                    <div className="text-xs text-slate-400 mt-1">/ {totalStats.easy}</div>
                </motion.div>

                {/* Medium */}
                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center"
                >
                    <div className="text-yellow-400 text-sm font-semibold mb-1">Medium</div>
                    <div className="text-3xl font-black text-white">{mediumCount}</div>
                    <div className="text-xs text-slate-400 mt-1">/ {totalStats.medium}</div>
                </motion.div>

                {/* Hard */}
                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center"
                >
                    <div className="text-red-400 text-sm font-semibold mb-1">Hard</div>
                    <div className="text-3xl font-black text-white">{hardCount}</div>
                    <div className="text-xs text-slate-400 mt-1">/ {totalStats.hard}</div>
                </motion.div>
            </div>

            {/* Achievement message */}
            {solvedCount > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center"
                >
                    <div className="flex items-center justify-center gap-2 text-cyan-400">
                        <Award size={16} />
                        <span className="text-sm font-semibold">
                            {solvedCount >= 100 ? '🏆 Coding Master!' :
                             solvedCount >= 50 ? '⭐ Great Progress!' :
                             solvedCount >= 20 ? '🚀 Keep Going!' :
                             solvedCount >= 10 ? '💪 Good Start!' :
                             '🎯 Begin Your Journey!'}
                        </span>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ProblemsSolvedSummary;
