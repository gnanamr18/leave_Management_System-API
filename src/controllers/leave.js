const { db } = require('../db');
const { leaveRequests, users } = require('../db/schema');
const { eq, and, gte, lte, or } = require('drizzle-orm');

/**
 * Create a new leave request
 */
const createLeaveRequest = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const userId = req.user.id;

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    if (start > end) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    // Check for overlapping leave requests
    const overlappingRequests = await db.select()
      .from(leaveRequests)
      .where(
        and(
          eq(leaveRequests.userId, userId),
          eq(leaveRequests.status, 'approved'),
          or(
            and(
              gte(leaveRequests.startDate, start),
              lte(leaveRequests.startDate, end)
            ),
            and(
              gte(leaveRequests.endDate, start),
              lte(leaveRequests.endDate, end)
            ),
            and(
              lte(leaveRequests.startDate, start),
              gte(leaveRequests.endDate, end)
            )
          )
        )
      );

    if (overlappingRequests.length > 0) {
      return res.status(400).json({ message: 'You already have approved leave during this period' });
    }

    // Create leave request
    const newLeaveRequest = await db.insert(leaveRequests)
      .values({
        userId,
        startDate: start,
        endDate: end,
        reason,
        status: 'pending'
      })
      .returning();

    res.status(201).json({
      message: 'Leave request created successfully',
      leaveRequest: newLeaveRequest[0]
    });
  } catch (error) {
    console.error('Create leave request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all leave requests for a user
 */
const getUserLeaveRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const userLeaveRequests = await db.select()
      .from(leaveRequests)
      .where(eq(leaveRequests.userId, userId))
      .orderBy(leaveRequests.createdAt, 'desc');

    res.json(userLeaveRequests);
  } catch (error) {
    console.error('Get user leave requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all leave requests (for managers)
 */
const getAllLeaveRequests = async (req, res) => {
  try {
    // Join with users table to get user information
    const allLeaveRequests = await db
      .select({
        id: leaveRequests.id,
        startDate: leaveRequests.startDate,
        endDate: leaveRequests.endDate,
        reason: leaveRequests.reason,
        status: leaveRequests.status,
        managerComment: leaveRequests.managerComment,
        createdAt: leaveRequests.createdAt,
        userId: leaveRequests.userId,
        username: users.username,
        fullName: users.fullName,
        email: users.email
      })
      .from(leaveRequests)
      .innerJoin(users, eq(leaveRequests.userId, users.id))
      .orderBy(leaveRequests.createdAt, 'desc');

    res.json(allLeaveRequests);
  } catch (error) {
    console.error('Get all leave requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a leave request status (for managers)
 */
const updateLeaveRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, managerComment } = req.body;

    if (!id || !status) {
      return res.status(400).json({ message: 'Request ID and status are required' });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    // Check if leave request exists
    const leaveRequestExists = await db.select()
      .from(leaveRequests)
      .where(eq(leaveRequests.id, parseInt(id)));

    if (leaveRequestExists.length === 0) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Update leave request
    const updatedLeaveRequest = await db.update(leaveRequests)
      .set({
        status,
        managerComment: managerComment || null,
        updatedAt: new Date()
      })
      .where(eq(leaveRequests.id, parseInt(id)))
      .returning();

    res.json({
      message: `Leave request ${status} successfully`,
      leaveRequest: updatedLeaveRequest[0]
    });
  } catch (error) {
    console.error('Update leave request status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createLeaveRequest,
  getUserLeaveRequests,
  getAllLeaveRequests,
  updateLeaveRequestStatus
}; 