const express = require('express');
const router = express.Router();

const {sendNotif,getUnreadNotif,markAsReadNotif,markAllAsReadNotif,deleteAllNotif} = require('../controllers/notificationController')
const verifyRole = require('../middleware/verifyRole')


router.get('/:email', verifyRole(["ADMIN","DIRECTEUR"]), getUnreadNotif);
router.post('/', verifyRole(["ADMIN","DIRECTEUR"]), sendNotif);
router.post('/mark-as-read', verifyRole(["ADMIN","DIRECTEUR"]), markAsReadNotif);
router.post('/mark-all-as-read', verifyRole(["ADMIN","DIRECTEUR"]), markAllAsReadNotif);
router.delete('/delete-all', verifyRole(["ADMIN","DIRECTEUR"]), deleteAllNotif);

module.exports = router;