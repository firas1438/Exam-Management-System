const express = require('express');
const router = express.Router();

// Import the examControllers
const { findExamProperties ,updateAssignment,getSupervisors,getCountsSummaryAdmin,getCountsSummaryDirector,getCountsSummaryHead } = require('../controllers/supervisorController');
const verifyRole = require('../middleware/verifyRole')

// Get all supervisors
router.get('/getAllSupervisors/:page',verifyRole("ADMIN"), getSupervisors);

// Generate reservation 
router.get('/auto-generate',verifyRole("ADMIN"), findExamProperties);



 // update an assignment
router.put('/adjust',verifyRole("ADMIN"), updateAssignment);

// Get the counts summary for admin
router.get('/getCountsSummaryAdmin',verifyRole("ADMIN"), getCountsSummaryAdmin);

// Get the counts summary for director
router.get('/getCountsSummaryDirector',verifyRole("DIRECTEUR"), getCountsSummaryDirector);

// Get the counts summary for head
router.get('/getCountsSummaryHead/:user_id',verifyRole("CHEF"), getCountsSummaryHead);

module.exports = router;