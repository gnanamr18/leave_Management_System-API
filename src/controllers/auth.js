const { db } = require('../db');
const { users } = require('../db/schema');
const { eq } = require('drizzle-orm');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

/**
 * Register a new user
 */
const register = async (req, res) => {
  try {
    const { username, password, email, fullName, role } = req.body;
    
    if (!username || !password || !email || !fullName) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.username, username));
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Check if email already exists
    const existingEmail = await db.select().from(users).where(eq(users.email, email));
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const newUser = await db.insert(users).values({
      username,
      password: hashedPassword,
      email,
      fullName,
      role: role || 'employee', // Default to employee if role not specified
    }).returning();
    
    // Generate token
    const token = generateToken({ 
      id: newUser[0].id, 
      username: newUser[0].username, 
      role: newUser[0].role 
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser[0].id,
        username: newUser[0].username,
        email: newUser[0].email,
        fullName: newUser[0].fullName,
        role: newUser[0].role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Login a user
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Find user
    const userResults = await db.select().from(users).where(eq(users.username, username));
    if (userResults.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = userResults[0];
    
    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken({ 
      id: user.id, 
      username: user.username, 
      role: user.role 
    });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login
}; 