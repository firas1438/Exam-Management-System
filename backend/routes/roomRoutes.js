const express = require('express');
const router = express.Router();

// Import the examControllers
const { getAllRooms,reserveExamSlot,updateExamRoom } = require('../controllers/roomController');

const verifyRole = require('../middleware/verifyRole')

// Get all rooms
router.get('/getAllRooms/:page',verifyRole("ADMIN"), getAllRooms);

//  add a new reservation
 router.post('/reserveRoom',verifyRole("ADMIN"), reserveExamSlot);

 // update a reservation
 router.put('/updateExam/:exam_id/:room_id',verifyRole("ADMIN"), updateExamRoom);



module.exports = router;