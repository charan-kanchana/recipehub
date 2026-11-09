const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers } = require('../controllers/userController');

// Authentication endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);

// Legacy and User management endpoints
router.post('/', registerUser);
router.get('/', getUsers);

module.exports = router;
