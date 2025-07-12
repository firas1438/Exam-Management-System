const express = require('express');
const router = express.Router();

// Import the examControllers
const { getAllExams,getNotReservedExams,getExamById, createExam, updateExam, deleteExam,getExamsByDeaprtment,getNotValidatedExamsByDeaprtment,getValidatedExamsByDeaprtment ,getNotValidatedExamsByDirector,
    getAllAssignedExams ,getPlanningForDirector,getExamsByRoomId,getExamsBySupervisorId,getExamsBySessionId} = require('../controllers/examController');

const verifyRole = require('../middleware/verifyRole')

// Get all exams
router.get('/getAllExams/:page/:session_id',verifyRole("ADMIN"), getAllExams);

// Get all exams by session id
router.get('/getExamsBySessionId/:selectedSession',verifyRole("ADMIN"), getExamsBySessionId);

// get all assigned exams 
router.get('/getAllAssignedExams',verifyRole("ADMIN"), getAllAssignedExams);

// Get exam selon id
router.get('/getExamById/:id',verifyRole("ADMIN"), getExamById);

// Get exams reserv by room id
router.get('/getExamsByRoomId/:room_id/',verifyRole("ADMIN"), getExamsByRoomId);

// Get exams by supervisor id
router.get('/getExamsBySupervisorId/:supervisor_id/',verifyRole("ADMIN"), getExamsBySupervisorId);

// Get exams by hod department
router.get('/getExamsByDeaprtment/:user_id/:page',verifyRole("CHEF"), getExamsByDeaprtment);

// Get not validated exams by hod department
router.get('/notValidatedExamsByDeaprtment/:user_id/:page',verifyRole("CHEF"), getNotValidatedExamsByDeaprtment);

// Get  validated exams by hod department
router.get('/validatedExamsByDeaprtment/:user_id/:page',verifyRole("CHEF"), getValidatedExamsByDeaprtment);

// // Get  not validated exams by director
// router.get('/notValidatedExamsByDirector',verifyRole("DIRECTEUR"), getNotValidatedExamsByDirector);

// // Get   validated exams by director
// router.get('/validatedExamsByDirector',verifyRole("DIRECTEUR"), getValidatedExamsByDirector);

// Get Reserved exam for room and teacher
router.get('/getExamsByDirector/:page',verifyRole("DIRECTEUR"), getPlanningForDirector);

// Get not Reserved exams
router.get('/getNotReservedExams',verifyRole("ADMIN"), getNotReservedExams);

// add a new exam
router.post('/createExam',verifyRole("ADMIN"), createExam);

// update an exam
router.put('/updateExam/:exam_id',verifyRole("ADMIN"), updateExam);

// delete an exam
router.delete('/deleteExam/:exam_id',verifyRole("ADMIN"), deleteExam);

module.exports = router;