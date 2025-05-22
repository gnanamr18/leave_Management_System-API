const express = require('express');
const { 
  createLeaveRequest, 
  getUserLeaveRequests, 
  getAllLeaveRequests, 
  updateLeaveRequestStatus 
} = require('../controllers/leave');
const { authenticateToken, isManager } = require('../middleware/auth');

const router = express.Router();

// Employee routes
router.post('/', authenticateToken, createLeaveRequest);
router.get('/me', authenticateToken, getUserLeaveRequests);

// Manager routes
router.get('/all', authenticateToken, isManager, getAllLeaveRequests);
router.patch('/:id', authenticateToken, isManager, updateLeaveRequestStatus);

module.exports = router; 