const express = require('express');
const router = express.Router();

// Import the examControllers
const { validateDepartmentEntries,validateGlobalPlanning} = require('../controllers/validateExams');
const verifyRole = require('../middleware/verifyRole')

// validate exams of a department
router.put('/departmentEntries',verifyRole("CHEF"), validateDepartmentEntries);

// validate all exams
router.put('/globalPlanning',verifyRole("DIRECTEUR"), validateGlobalPlanning);





module.exports = router;