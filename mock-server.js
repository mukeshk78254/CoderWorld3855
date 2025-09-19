const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}));
app.use(express.json());

// Mock data for testing
const mockProblems = [
    {
        _id: "681a827e01442250b54c0dac",
        title: "Two Sum",
        difficulty: "easy",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        tags: ["Array", "Hash Table"],
        visibletestcases: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
            { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
        ],
        hiddentestcases: [
            { input: "nums = [3,3], target = 6", output: "[0,1]" }
        ],
        startcode: [
            { language: "javascript", initialcode: "function twoSum(nums, target) {\n    // Your code here\n}" },
            { language: "cpp", initialcode: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n    }\n};" }
        ]
    }
];

// Mock submission responses
const mockRunResponse = [
    {
        stdout: "Test case 1 passed",
        stderr: null,
        compile_output: null,
        status: { id: 3, description: "Accepted" }
    },
    {
        stdout: "Test case 2 passed", 
        stderr: null,
        compile_output: null,
        status: { id: 3, description: "Accepted" }
    }
];

const mockSubmitResponse = {
    status: "accepted",
    testCasesPassed: 3,
    testCasesTotal: 3,
    runtime: 45,
    memory: 1024,
    errorMessage: null
};

// Routes
app.get('/problem/problembyid/:id', (req, res) => {
    const problem = mockProblems.find(p => p._id === req.params.id);
    if (problem) {
        res.json(problem);
    } else {
        res.status(404).json({ error: "Problem not found" });
    }
});

app.get('/problem/getallproblem', (req, res) => {
    res.json(mockProblems);
});

app.post('/submission/run/:id', (req, res) => {
    console.log('🚀 Run request received:', req.body);
    
    // Simulate processing delay
    setTimeout(() => {
        res.json(mockRunResponse);
    }, 1000);
});

app.post('/submission/submit/:id', (req, res) => {
    console.log('📝 Submit request received:', req.body);
    
    // Simulate processing delay
    setTimeout(() => {
        res.json(mockSubmitResponse);
    }, 1500);
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Mock server is running!' });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log('🚀 Mock Backend Server running on port', PORT);
    console.log('✅ Ready to handle run/submit requests!');
    console.log('🔗 Frontend can connect to: http://localhost:' + PORT);
});

module.exports = app;

