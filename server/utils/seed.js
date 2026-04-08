require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Notice = require('../models/Notice');
const connectDB = require('../config/db');

const seedData = async () => {
  await connectDB();

  try {
    await User.deleteMany();
    await Notice.deleteMany();

    const users = [];

    // Admin
    users.push({
      name: 'Admin User',
      email: 'admin@college.edu',
      password: 'password123',
      role: 'admin'
    });

    // CRs
    for (let i = 1; i <= 2; i++) {
        users.push({
            name: `CR User ${i}`,
            email: `cr${i}@college.edu`,
            password: 'password123',
            role: 'cr',
            branch: 'CS',
            year: 3
        });
    }

    // Students
    for (let i = 1; i <= 5; i++) {
      users.push({
        name: `Student ${i}`,
        email: `student${i}@college.edu`,
        password: 'password123',
        role: 'student',
        branch: i % 2 === 0 ? 'CS' : 'IT',
        year: (i % 4) + 1,
        rollNumber: `ROLL${1000 + i}`
      });
    }

    const createdUsers = [];
    for (const u of users) {
      createdUsers.push(await User.create(u));
    }
    const crId = createdUsers.find(u => u.role === 'cr')._id;

    const categories = ['Academic', 'Exam', 'Event', 'Holiday', 'Urgent', 'General'];
    const notices = [];

    for (let i = 1; i <= 10; i++) {
      notices.push({
        title: `Sample Notice ${i}`,
        description: `<p>This is a sample description for notice ${i} with <strong>rich text</strong>.</p>`,
        category: categories[i % categories.length],
        priority: categories[i % categories.length] === 'Urgent' ? 'urgent' : 'normal',
        postedBy: crId,
        targetAudience: { type: 'all' }
      });
    }

    await Notice.insertMany(notices);

    console.log('Data Imported successfully');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

seedData();
