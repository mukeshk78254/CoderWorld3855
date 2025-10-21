
const mongoose = require('mongoose');
const User = require('../models/users');
const Submission = require('../models/submission');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const migrateProblemsSolved = async () => {
    try {
       
        await mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

       
        const users = await User.find({});
        console.log(`Found ${users.length} users to process`);

        let totalUpdated = 0;
        let totalProblemsAdded = 0;

        for (const user of users) {
            console.log(`\n👤 Processing user: ${user.emailId} (ID: ${user._id})`);

           
            const acceptedSubmissions = await Submission.find({
                userid: user._id,
                status: 'accepted'
            }).select('problemid');

            if (acceptedSubmissions.length === 0) {
                console.log('   No accepted submissions found');
                continue;
            }

            
            const uniqueProblemIds = [...new Set(
                acceptedSubmissions
                    .filter(sub => sub.problemid) 
                    .map(sub => sub.problemid.toString())
            )];

            console.log(`   Found ${acceptedSubmissions.length} accepted submissions`);
            console.log(`   Unique problems: ${uniqueProblemIds.length}`);

            
            const result = await User.findByIdAndUpdate(
                user._id,
                { $set: { problemsSolved: uniqueProblemIds } },
                { new: true }
            );

            if (result) {
                console.log(`    Updated problemsSolved: ${result.problemsSolved.length} problems`);
                totalUpdated++;
                totalProblemsAdded += uniqueProblemIds.length;
            }
        }

        console.log('\n═══════════════════════════════════════');
        console.log('Migration Complete!');
        console.log(`   Users updated: ${totalUpdated}`);
        console.log(`   Total problems added: ${totalProblemsAdded}`);
        console.log('═══════════════════════════════════════\n');

      
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};


migrateProblemsSolved();
