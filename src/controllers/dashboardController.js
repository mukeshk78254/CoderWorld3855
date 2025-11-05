const User = require('../models/users');
const Problem = require('../models/problem');
const Submission = require('../models/submission');


const getDashboardData = async (req, res) => {
    try {
        const { userid } = req.params;

       
        if (req.user.id.toString() !== userid) {
            return res.status(403).json({ 
                message: 'Forbidden: You can only access your own dashboard data.' 
            });
        }

        const [user, totalStats, allSubmissions, successfulSubmissions] = await Promise.all([
            
            User.findById(userid).populate('problemsSolved').lean(),

            
            Problem.aggregate([
                { $group: { _id: "$difficulty", count: { $sum: 1 } } }
            ]),

            
            Submission.find({ userid: userid })
                .sort({ createdAt: -1 })
                .populate('problemid', 'title difficulty tags')
                .lean(),

           
            Submission.find({ userid: userid, status: 'accepted' })
                .sort({ createdAt: -1 })
                .populate('problemid', 'title difficulty tags')
                .lean()
        ]);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const formattedTotalStats = { easy: 0, medium: 0, hard: 0 };
        totalStats.forEach(stat => {
            if (formattedTotalStats.hasOwnProperty(stat._id)) {
                formattedTotalStats[stat._id] = stat.count;
            }
        });

       
        const solvedProblems = user.problemsSolved || [];

        
        const solvedStats = { easy: 0, medium: 0, hard: 0 };
        const solvedTags = new Set();
        const tagStats = {};

        solvedProblems.forEach(p => {
            if (p.difficulty) {
                const difficultyKey = p.difficulty.toLowerCase();
                if (solvedStats.hasOwnProperty(difficultyKey)) {
                    solvedStats[difficultyKey]++;
                }
            }
            if (p.tags && Array.isArray(p.tags)) {
                p.tags.forEach(tag => {
                    const tagLower = tag.toLowerCase();
                    solvedTags.add(tagLower);
                    tagStats[tagLower] = (tagStats[tagLower] || 0) + 1;
                });
            }
        });

       
        const currentStreak = calculateCurrentStreak(allSubmissions);
        const longestStreak = calculateLongestStreak(allSubmissions);
        const streakHistory = calculateStreakHistory(allSubmissions);

      
        const performanceData = calculatePerformanceData(allSubmissions, 30);
        
       
        const weeklyData = calculatePerformanceData(allSubmissions, 7);

      
        const languageStats = calculateLanguageStats(allSubmissions);

        
        const solvingPatterns = calculateSolvingPatterns(allSubmissions);

       
        const recentActivity = successfulSubmissions.slice(0, 15).map(sub => ({
            _id: sub._id,
            status: sub.status,
            problemTitle: sub.problemid ? sub.problemid.title : 'Unknown Problem',
            problemId: sub.problemid ? sub.problemid._id : null,
            difficulty: sub.problemid ? sub.problemid.difficulty : 'unknown',
            language: sub.language,
            runtime: sub.runtime,
            memory: sub.memory,
            timestamp: sub.createdAt,
        }));

       
        const submissionHeatmap = calculateSubmissionHeatmap(allSubmissions);   
        
       
        const submissionActivity = allSubmissions.map(sub => sub.createdAt);
        
        // Calculate yearly progress with daily submission data
        const yearlyProgress = calculateYearlyProgress(allSubmissions);

      
        const successRateByDifficulty = calculateSuccessRateByDifficulty(allSubmissions);

       
        const dashboardData = {
           
            solvedCount: solvedProblems.length, 
            easyCount: solvedStats.easy, 
            mediumCount: solvedStats.medium, 
            hardCount: solvedStats.hard, 
            totalSubmissions: allSubmissions.length,
            successfulSubmissions: successfulSubmissions.length,
            
            
            currentStreak,
            longestStreak,
            streakHistory,
            
           
            solvedStats,
            totalStats: formattedTotalStats,
            successRateByDifficulty,
            
         
            recentActivity,
            performanceData,
            weeklyData,
            submissionHeatmap,
            submissionActivity,
            
          
            languageStats,
            solvingPatterns,
            solvedTags: Array.from(solvedTags).sort(),
            tagStats,
            
           
            averageRuntime: calculateAverageRuntime(successfulSubmissions),
            averageMemory: calculateAverageMemory(successfulSubmissions),
            totalProblemsAttempted: new Set(allSubmissions.map(s => s.problemid?._id)).size,
            
          
            submissionsToday: getSubmissionsForDay(allSubmissions, new Date()),
            submissionsThisWeek: getSubmissionsForWeek(allSubmissions),
            submissionsThisMonth: getSubmissionsForMonth(allSubmissions),
            
            // Yearly progress data for calendar view with green marks on submission dates
            yearlyProgress,
        };

        res.status(200).json(dashboardData);

    } catch (error) {
        console.error('Error fetching enhanced dashboard data:', error);
        res.status(500).json({ 
            message: 'Internal Server Error', 
            error: error.message 
        });
    }
};


function calculateCurrentStreak(submissions) {
    if (!submissions || submissions.length === 0) return 0;

    
    const uniqueDates = [...new Set(submissions.map(s => 
        new Date(s.createdAt).toDateString()
    ))].map(dateStr => new Date(dateStr)).sort((a, b) => b - a);

    if (uniqueDates.length === 0) return 0;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    
    const mostRecentDate = uniqueDates[0];
    if (mostRecentDate.toDateString() !== today.toDateString() && 
        mostRecentDate.toDateString() !== yesterday.toDateString()) {
        return 0; 
    }

    let streak = 1;
    let lastDate = mostRecentDate;

    for (let i = 1; i < uniqueDates.length; i++) {
        const expectedPrevDate = new Date(lastDate);
        expectedPrevDate.setDate(expectedPrevDate.getDate() - 1);

        if (uniqueDates[i].toDateString() === expectedPrevDate.toDateString()) {
            streak++;
            lastDate = uniqueDates[i];
        } else {
            break;
        }
    }

    return streak;
}


function calculateLongestStreak(submissions) {
    if (!submissions || submissions.length === 0) return 0;

    const uniqueDates = [...new Set(submissions.map(s => 
        new Date(s.createdAt).toDateString()
    ))].map(dateStr => new Date(dateStr)).sort((a, b) => a - b); 

    if (uniqueDates.length === 0) return 0;

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1]);
        const currentDate = new Date(uniqueDates[i]);
        const expectedNextDate = new Date(prevDate);
        expectedNextDate.setDate(expectedNextDate.getDate() + 1);

        if (currentDate.toDateString() === expectedNextDate.toDateString()) {
            currentStreak++;
        } else {
            longestStreak = Math.max(longestStreak, currentStreak);
            currentStreak = 1;
        }
    }

    return Math.max(longestStreak, currentStreak);
}


function calculateStreakHistory(submissions) {
    if (!submissions || submissions.length === 0) return [];

    const uniqueDates = [...new Set(submissions.map(s => 
        new Date(s.createdAt).toDateString()
    ))].map(dateStr => new Date(dateStr)).sort((a, b) => a - b);

    const streaks = [];
    let currentStreak = 1;
    let streakStart = uniqueDates[0];

    for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1]);
        const currentDate = new Date(uniqueDates[i]);
        const expectedNextDate = new Date(prevDate);
        expectedNextDate.setDate(expectedNextDate.getDate() + 1);

        if (currentDate.toDateString() === expectedNextDate.toDateString()) {
            currentStreak++;
        } else {
            streaks.push({
                start: streakStart,
                end: uniqueDates[i - 1],
                length: currentStreak
            });
            currentStreak = 1;
            streakStart = currentDate;
        }
    }

   
    if (currentStreak > 0) {
        streaks.push({
            start: streakStart,
            end: uniqueDates[uniqueDates.length - 1],
            length: currentStreak
        });
    }

    return streaks.slice(-10); 
}


function calculatePerformanceData(submissions, days) {
    const performanceData = [];
    const submissionCountsByDay = {};

    submissions.forEach(sub => {
        const date = new Date(sub.createdAt).toDateString();
        submissionCountsByDay[date] = (submissionCountsByDay[date] || 0) + 1;
    });

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const count = submissionCountsByDay[date.toDateString()] || 0;
        performanceData.push({ 
            name: dayName, 
            submissions: count,
            date: date.toDateString()
        });
    }

    return performanceData;
}


function calculateLanguageStats(submissions) {
    const languageCounts = {};
    submissions.forEach(sub => {
        languageCounts[sub.language] = (languageCounts[sub.language] || 0) + 1;
    });

    return Object.entries(languageCounts)
        .map(([language, count]) => ({ language, count }))
        .sort((a, b) => b.count - a.count);
}


function calculateSolvingPatterns(submissions) {
    const patterns = {
        morning: 0,    // 6 AM - 12 PM
        afternoon: 0,  // 12 PM - 6 PM
        evening: 0,    // 6 PM - 12 AM
        night: 0       // 12 AM - 6 AM
    };

    submissions.forEach(sub => {
        const hour = new Date(sub.createdAt).getHours();
        if (hour >= 6 && hour < 12) patterns.morning++;
        else if (hour >= 12 && hour < 18) patterns.afternoon++;
        else if (hour >= 18 && hour < 24) patterns.evening++;
        else patterns.night++;
    });

    return patterns;
}


function calculateSubmissionHeatmap(submissions) {
    const heatmap = {};
    submissions.forEach(sub => {
        const date = new Date(sub.createdAt).toDateString();
        heatmap[date] = (heatmap[date] || 0) + 1;
    });
    return heatmap;
}


function calculateSuccessRateByDifficulty(submissions) {
    const difficultyStats = {};
    
    submissions.forEach(sub => {
        const difficulty = sub.problemid?.difficulty || 'unknown';
        if (!difficultyStats[difficulty]) {
            difficultyStats[difficulty] = { total: 0, successful: 0 };
        }
        difficultyStats[difficulty].total++;
        if (sub.status === 'accepted') {
            difficultyStats[difficulty].successful++;
        }
    });

    const successRates = {};
    Object.entries(difficultyStats).forEach(([difficulty, stats]) => {
        successRates[difficulty] = stats.total > 0 ? 
            Math.round((stats.successful / stats.total) * 100) : 0;
    });

    return successRates;
}


function calculateAverageRuntime(successfulSubmissions) {
    if (successfulSubmissions.length === 0) return 0;
    const totalRuntime = successfulSubmissions.reduce((sum, sub) => sum + (sub.runtime || 0), 0);
    return Math.round(totalRuntime / successfulSubmissions.length);
}


function calculateAverageMemory(successfulSubmissions) {
    if (successfulSubmissions.length === 0) return 0;
    const totalMemory = successfulSubmissions.reduce((sum, sub) => sum + (sub.memory || 0), 0);
    return Math.round(totalMemory / successfulSubmissions.length);
}


function getSubmissionsForDay(submissions, date) {
    const targetDate = date.toDateString();
    return submissions.filter(sub => 
        new Date(sub.createdAt).toDateString() === targetDate
    ).length;
}

function getSubmissionsForWeek(submissions) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return submissions.filter(sub => 
        new Date(sub.createdAt) >= weekAgo
    ).length;
}


function getSubmissionsForMonth(submissions) {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return submissions.filter(sub => 
        new Date(sub.createdAt) >= monthAgo
    ).length;
}


function calculateYearlyProgress(submissions) {
    const yearAgo = new Date();
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    
    // Get all submissions from the last year
    const yearlySubmissions = submissions.filter(sub => 
        new Date(sub.createdAt) >= yearAgo
    );
    
    // Create a map of dates with submission counts
    const dailySubmissions = {};
    const dailyAcceptedSubmissions = {};
    
    yearlySubmissions.forEach(sub => {
        const date = new Date(sub.createdAt);
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        // Count all submissions
        dailySubmissions[dateKey] = (dailySubmissions[dateKey] || 0) + 1;
        
        // Count accepted submissions
        if (sub.status === 'accepted') {
            dailyAcceptedSubmissions[dateKey] = (dailyAcceptedSubmissions[dateKey] || 0) + 1;
        }
    });
    
    // Generate array of all days in the year with counts
    const yearlyData = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        yearlyData.push({
            date: dateKey,
            dayOfWeek: date.getDay(), // 0-6 (Sunday-Saturday)
            month: date.getMonth(), // 0-11
            submissions: dailySubmissions[dateKey] || 0,
            acceptedSubmissions: dailyAcceptedSubmissions[dateKey] || 0,
            hasActivity: (dailySubmissions[dateKey] || 0) > 0
        });
    }
    
    return {
        dailyData: yearlyData,
        totalDaysActive: Object.keys(dailySubmissions).length,
        totalSubmissions: yearlySubmissions.length,
        totalAccepted: yearlySubmissions.filter(s => s.status === 'accepted').length,
        heatmapData: dailySubmissions, // For easy lookup: { "2024-01-15": 5, ... }
        acceptedDates: Object.keys(dailyAcceptedSubmissions) // Array of dates with accepted submissions
    };
}

module.exports = {
    getDashboardData
};
