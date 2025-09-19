const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Problem = require('../models/problem');
const Submission = require('../models/submission');
const usermiddleware = require("../middleware/middle");

router.get('/:userid/dashboard-pro', usermiddleware, async (req, res) => {
    try {
        const { userid } = req.params;

        // This check now correctly accesses req.user.id, which is set by the middleware.
        if (req.user.id.toString() !== userid) {
            return res.status(403).json({ message: 'Forbidden: You can only access your own dashboard data.' });
        }

        const [user, totalStats, successfulSubmissions] = await Promise.all([
            // User schema uses 'problemsolved'
            User.findById(userid).populate('problemsolved').lean(),

            // Aggregate total problems by difficulty
            Problem.aggregate([
                { $group: { _id: "$difficulty", count: { $sum: 1 } } }
            ]),

            // ✅ FIX: Changed 'userid' to 'user' in the query to match updated Submission schema
            Submission.find({ user: userid, status: 'Accepted' }) 
                .sort({ createdAt: -1 })
                .populate('problemid', 'title') // Populate problem details for recent activity
                .lean()
        ]);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Format total problems by difficulty
        const formattedTotalStats = { easy: 0, medium: 0, hard: 0 };
        totalStats.forEach(stat => {
            if (formattedTotalStats.hasOwnProperty(stat._id)) {
                formattedTotalStats[stat._id] = stat.count;
            }
        });

        // Calculate solved problems by difficulty and gather tags
        const solvedProblems = user.problemsolved || []; 
        const solvedStats = { easy: 0, medium: 0, hard: 0 };
        const solvedTags = new Set();
        
        solvedProblems.forEach(p => {
            if (p.difficulty) {
                // Ensure difficulty is one of the keys
                const difficultyKey = p.difficulty.toLowerCase();
                if (solvedStats.hasOwnProperty(difficultyKey)) {
                    solvedStats[difficultyKey]++;
                }
            }
            // Problem schema's 'tags' is now an array, so this works correctly.
            if (p.tags && Array.isArray(p.tags)) { 
                p.tags.forEach(tag => solvedTags.add(tag.toLowerCase()));
            }
        });
        
        // Streak calculation
        const submissionTimestamps = successfulSubmissions.map(sub => sub.createdAt);
        const uniqueDates = [...new Set(submissionTimestamps.map(ts => new Date(ts).toDateString()))]
            .map(dateStr => new Date(dateStr)).sort((a, b) => b - a); // Sort newest to oldest
        
        let currentStreak = 0;
        if (uniqueDates.length > 0) {
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            
            // Check if there was a submission today or yesterday to start the streak
            if (uniqueDates[0].toDateString() === today.toDateString() || uniqueDates[0].toDateString() === yesterday.toDateString()) {
                currentStreak = 1;
                let lastDate = uniqueDates[0];
                for (let i = 1; i < uniqueDates.length; i++) {
                    const expectedPrevDate = new Date(lastDate);
                    expectedPrevDate.setDate(expectedPrevDate.getDate() - 1); // Get the day before lastDate
                    
                    if (uniqueDates[i].toDateString() === expectedPrevDate.toDateString()) {
                        currentStreak++;
                        lastDate = uniqueDates[i];
                    } else {
                        // If there's a gap, streak breaks
                        break; 
                    }
                }
            }
        }
        
        // Performance data (submissions per day for the last 7 days)
        const performanceData = [];
        const submissionCountsByDay = {};
        successfulSubmissions.forEach(sub => {
            const date = new Date(sub.createdAt).toDateString();
            submissionCountsByDay[date] = (submissionCountsByDay[date] || 0) + 1;
        });

        for (let i = 6; i >= 0; i--) { // Loop for 7 days, from 6 days ago to today
            const date = new Date();
            date.setDate(date.getDate() - i); // Correctly sets date to i days ago
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const count = submissionCountsByDay[date.toDateString()] || 0;
            performanceData.push({ name: dayName, submissions: count });
        }
        // Ensure data is ordered from oldest to newest day for charting
        performanceData.reverse(); 
        
        // Recent activity feed (last 10 successful submissions)
        const recentActivity = successfulSubmissions.slice(0, 10).map(sub => ({
            _id: sub._id,
            status: sub.status,
            problemTitle: sub.problemid ? sub.problemid.title : 'Unknown Problem', // Fallback title
            problemId: sub.problemid ? sub.problemid._id : null,
            timestamp: sub.createdAt,
        }));

        // Assemble final dashboard data object
        const dashboardData = {
            solvedCount: solvedProblems.length,
            totalSubmissions: successfulSubmissions.length,
            currentStreak,
            solvedStats, // Solved problems by difficulty
            totalStats: formattedTotalStats, // Total problems by difficulty
            submissionActivity: submissionTimestamps, // Raw timestamps for heat map or detailed analysis
            recentActivity,
            performanceData, // Submissions per day for last 7 days
            solvedTags: Array.from(solvedTags).sort(), // Unique solved tags
        };

        res.status(200).json(dashboardData);

    } catch (error) {
        console.error('Error fetching dashboard data for user:', req.params.userid, error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message }); // Provide more error detail in development
    }
});

module.exports = router;