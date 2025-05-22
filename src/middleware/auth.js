const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

const isManager = (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Manager role required.' });
  }
};

module.exports = { 
  authenticateToken, 
  isManager 
}; 