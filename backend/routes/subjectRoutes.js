const express = require('express');
const router = express.Router();

// Import the subjectControllers
const { getAllSubject} = require('../controllers/subjectController');

const verifyRole = require('../middleware/verifyRole')

// Get all subjects
router.get('/getAllSubjects',verifyRole("ADMIN"), getAllSubject);

module.exports = router;