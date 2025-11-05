import { motion } from 'framer-motion';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

function StatsCards({ stats }) {
    // Add default values to prevent errors
    const { 
        solvedStats = { easy: 0, medium: 0, hard: 0 }, 
        totalStats = { easy: 0, medium: 0, hard: 0 }, 
        solvedCount = 0,
        totalSubmissions = 0,
        successfulSubmissions = 0,
        currentStreak = 0
    } = stats || {};

    // Calculate success rate
    const successRate = totalSubmissions > 0 
        ? Math.round((successfulSubmissions / totalSubmissions) * 100) 
        : 0;

    // Calculate performance grade
    const getPerformanceGrade = (rate) => {
        if (rate >= 90) return 'A+';
        if (rate >= 80) return 'A';
        if (rate >= 70) return 'B';
        if (rate >= 60) return 'C';
        if (rate >= 50) return 'D';
        return 'F';
    };

    const performanceGrade = getPerformanceGrade(successRate);
    const totalProblems = totalStats.easy + totalStats.medium + totalStats.hard;

    return (
        <div className="space-y-6">
            {/* Top 4 Cards in a Row */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1 } }
                }}
                initial="hidden"
                animate="visible"
            >
                {/* Problems Solved Card */}
                <motion.div 
                    variants={cardVariants}
                    className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 backdrop-blur-sm"
                >
                    <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-semibold text-cyan-400 uppercase">Problems Solved</p>
                        <div className="text-cyan-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-white">{solvedCount}</p>
                    <p className="text-xs text-gray-400 mt-1">/ {totalProblems}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        E:{solvedStats.easy} | M:{solvedStats.medium} | H:{solvedStats.hard}
                    </p>
                </motion.div>

                {/* Current Streak Card */}
                <motion.div 
                    variants={cardVariants}
                    className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 backdrop-blur-sm"
                >
                    <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-semibold text-red-400 uppercase">Current Streak</p>
                        <div className="text-red-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-white">{currentStreak}</p>
                    <p className="text-xs text-gray-400 mt-3">
                        {currentStreak === 0 ? 'Start coding!' : 'Keep it up!'}
                    </p>
                </motion.div>

                {/* Total Submissions Card */}
                <motion.div 
                    variants={cardVariants}
                    className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 backdrop-blur-sm"
                >
                    <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-semibold text-blue-400 uppercase">Total Submissions</p>
                        <div className="text-blue-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-white">{totalSubmissions}</p>
                    <p className="text-xs text-gray-400 mt-3">{successRate}% success rate</p>
                </motion.div>

                {/* Performance Grade Card */}
                <motion.div 
                    variants={cardVariants}
                    className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 backdrop-blur-sm"
                >
                    <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-semibold text-pink-400 uppercase">Performance Grade</p>
                        <div className="text-pink-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-white">{performanceGrade}</p>
                    <p className="text-xs text-gray-400 mt-3">{successRate}% accuracy</p>
                </motion.div>
            </motion.div>

            {/* Unique Problems Solved Section */}
            <motion.div 
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 backdrop-blur-sm"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-white">Unique Problems Solved</h3>
                    </div>
                    <span className="text-2xl font-bold text-cyan-400">{solvedCount}</span>
                </div>

                <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{solvedCount} / {totalProblems} ({totalProblems > 0 ? ((solvedCount / totalProblems) * 100).toFixed(1) : 0}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                            className="bg-cyan-400 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${totalProblems > 0 ? (solvedCount / totalProblems) * 100 : 0}%` }}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Easy */}
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-emerald-500/30">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-emerald-400">Easy</span>
                            <span className="text-lg font-bold text-white">{solvedStats.easy}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">/ {totalStats.easy}</p>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div 
                                className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${totalStats.easy > 0 ? (solvedStats.easy / totalStats.easy) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Medium */}
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-amber-500/30">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-amber-400">Medium</span>
                            <span className="text-lg font-bold text-white">{solvedStats.medium}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">/ {totalStats.medium}</p>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div 
                                className="bg-amber-400 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${totalStats.medium > 0 ? (solvedStats.medium / totalStats.medium) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Hard */}
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-red-500/30">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-red-400">Hard</span>
                            <span className="text-lg font-bold text-white">{solvedStats.hard}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">/ {totalStats.hard}</p>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div 
                                className="bg-red-400 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${totalStats.hard > 0 ? (solvedStats.hard / totalStats.hard) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default StatsCards;
