const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Submission = require('../models/submission');


router.post('/migrate-problems-solved/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log('🔄 Starting migration for user:', userId);
        
     
        const acceptedSubmissions = await Submission.find({
            userid: userId,
            status: 'accepted'
        }).select('problemid');
        
        console.log('✅ Found accepted submissions:', acceptedSubmissions.length);
        
      
        const uniqueProblemIds = [...new Set(
            acceptedSubmissions
                .map(sub => sub.problemid?.toString())
                .filter(id => id)
        )];
        
        console.log('📝 Unique problems:', uniqueProblemIds.length);
        
       
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { problemsSolved: uniqueProblemIds } },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        console.log(' Migration completed! Total unique problems:', updatedUser.problemsSolved.length);
        
        res.status(200).json({
            success: true,
            message: 'Migration completed successfully',
            totalSubmissions: acceptedSubmissions.length,
            uniqueProblems: uniqueProblemIds.length,
            problemsSolved: updatedUser.problemsSolved.length
        });
        
    } catch (error) {
        console.error(' Migration error:', error);
        res.status(500).json({
            success: false,
            message: 'Migration failed',
            error: error.message
        });
    }
});


router.get('/check-problems-solved/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId).select('problemsSolved');
        const acceptedSubmissions = await Submission.find({
            userid: userId,
            status: 'accepted'
        });
        
        const uniqueProblems = [...new Set(
            acceptedSubmissions
                .map(sub => sub.problemid?.toString())
                .filter(id => id)
        )];
        
        res.status(200).json({
            currentlySaved: user?.problemsSolved?.length || 0,
            acceptedSubmissions: acceptedSubmissions.length,
            uniqueProblemsFromSubmissions: uniqueProblems.length,
            needsMigration: (user?.problemsSolved?.length || 0) !== uniqueProblems.length
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
