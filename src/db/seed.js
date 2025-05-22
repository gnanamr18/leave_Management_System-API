const { db } = require('./index');
const { users } = require('./schema');
const { hashPassword } = require('../utils/auth');
require('dotenv').config();

// Seed function
const seed = async () => {
  console.log('Seeding database...');
  
  try {
    // Check if admin user already exists
    const adminExists = await db.select()
      .from(users)
      .where(db.eq(users.username, 'admin'));
    
    if (adminExists.length === 0) {
      // Create a manager user
      await db.insert(users).values({
        username: 'admin',
        password: await hashPassword('admin123'),
        email: 'admin@example.com',
        fullName: 'Admin User',
        role: 'manager'
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists, skipping...');
    }
    
    // Check if new manager user already exists
    const managerExists = await db.select()
      .from(users)
      .where(db.eq(users.username, 'manager'));
    
    if (managerExists.length === 0) {
      // Create a new manager user
      await db.insert(users).values({
        username: 'manager',
        password: await hashPassword('1234'),
        email: 'manager@example.com',
        fullName: 'Manager User',
        role: 'manager'
      });
      console.log('Manager user created');
    } else {
      console.log('Manager user already exists, skipping...');
    }
    
    // Check if example employee already exists
    const employeeExists = await db.select()
      .from(users)
      .where(db.eq(users.username, 'employee'));
    
    if (employeeExists.length === 0) {
      // Create an employee user
      await db.insert(users).values({
        username: 'employee',
        password: await hashPassword('employee123'),
        email: 'employee@example.com',
        fullName: 'Employee User',
        role: 'employee'
      });
      console.log('Employee user created');
    } else {
      console.log('Employee user already exists, skipping...');
    }
    
    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run seed
seed(); 