const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Problem = require('../models/problem');
const Submission = require('../models/submission');
const usermiddleware = require("../middleware/middle");
const { getDashboardData } = require('../controllers/dashboardController');


router.get('/:userid/dashboard-pro', usermiddleware, getDashboardData);

module.exports = router;