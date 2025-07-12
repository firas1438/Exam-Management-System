const express = require('express');
const router = express.Router();

const { getSessions, addSession,getLastSession } = require('../controllers/sesssionController');
const verifyRole = require('../middleware/verifyRole')


router.get('/', verifyRole("ADMIN"), getSessions);
router.get('/current', verifyRole("ADMIN"), getLastSession);
router.post('/', verifyRole("ADMIN"), addSession);

module.exports = router;