const express = require('express');
const router = express.Router();

const {handleLogin,handleLogout,handleRefreshToken} = require('../controllers/authController');

//  login route
router.post('/login', handleLogin);


//  logout route
router.get('/logout', handleLogout);

//  refresh token route
router.get('/refreshToken', handleRefreshToken);


 module.exports = router;