const { db } = require('../db');
const { users } = require('../db/schema');
const { eq, ne } = require('drizzle-orm');

/**
 * Get the profile of the current user
 */
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userResult = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      createdAt: users.createdAt
    })
    .from(users)
    .where(eq(users.id, userId));
    
    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(userResult[0]);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all employees (for managers)
 */
const getAllEmployees = async (req, res) => {
  try {
    const employees = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      fullName: users.fullName,
      createdAt: users.createdAt
    })
    .from(users)
    .where(eq(users.role, 'employee'));
    
    res.json(employees);
  } catch (error) {
    console.error('Get all employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCurrentUser,
  getAllEmployees
}; 