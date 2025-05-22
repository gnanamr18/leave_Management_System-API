const { pgTable, serial, varchar, text, date, timestamp, boolean, integer } = require('drizzle-orm/pg-core');
const { pgEnum } = require('drizzle-orm/pg-core');

// User roles enum
const userRoles = pgEnum('user_role', ['employee', 'manager']);

// Users table
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  role: userRoles('role').notNull().default('employee'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Leave status enum
const leaveStatusEnum = pgEnum('leave_status', ['pending', 'approved', 'rejected']);

// Leave requests table
const leaveRequests = pgTable('leave_requests', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  reason: text('reason').notNull(),
  status: leaveStatusEnum('status').notNull().default('pending'),
  managerComment: text('manager_comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

module.exports = {
  users,
  leaveRequests,
  userRoles,
  leaveStatusEnum
}; 