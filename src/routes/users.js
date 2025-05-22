const express = require('express');
const { getCurrentUser, getAllEmployees } = require('../controllers/user');
const { authenticateToken, isManager } = require('../middleware/auth');

const router = express.Router();

// Get current user profile
router.get('/me', authenticateToken, getCurrentUser);

// Get all employees (manager only)
router.get('/employees', authenticateToken, isManager, getAllEmployees);

module.exports = router; 