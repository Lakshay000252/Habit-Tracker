const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Habit = require('../models/Habit');
const Progress = require('../models/Progress');
const Achievement = require('../models/Achievement');

const connectDB = require('../config/db');

const seedUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    avatar: '',
    role: 'user',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    avatar: '',
    role: 'user',
  },
  {
    name: 'Admin User',
    email: 'admin@habitai.com',
    password: 'admin123456',
    avatar: '',
    role: 'admin',
  },
];

const seedHabits = [
  {
    habitName: 'Morning Meditation',
    description: '10 minutes of mindfulness meditation every morning',
    category: 'meditation',
    targetFrequency: 'daily',
    reminderTime: '06:30',
    color: '#8b5cf6',
  },
  {
    habitName: 'Read 20 Pages',
    description: 'Read at least 20 pages of a book daily',
    category: 'reading',
    targetFrequency: 'daily',
    reminderTime: '21:00',
    color: '#f59e0b',
  },
  {
    habitName: 'Morning Jog',
    description: '30 minutes of jogging in the park',
    category: 'exercise',
    targetFrequency: 'daily',
    reminderTime: '07:00',
    color: '#10b981',
  },
  {
    habitName: 'Study Session',
    description: '1 hour of focused study time',
    category: 'study',
    targetFrequency: 'daily',
    reminderTime: '10:00',
    color: '#6366f1',
  },
  {
    habitName: 'Drink 8 Glasses of Water',
    description: 'Stay hydrated throughout the day',
    category: 'water',
    targetFrequency: 'daily',
    reminderTime: '09:00',
    color: '#06b6d4',
  },
];

const seedProgress = (userId, habitIds) => {
  const records = [];
  const today = new Date();

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);

    const shouldComplete = Math.random() > 0.25;

    for (const habitId of habitIds) {
      if (shouldComplete || Math.random() > 0.5) {
        records.push({
          userId,
          habitId,
          date,
          completed: true,
        });
      }
    }
  }

  return records;
};

const seedAchievements = (userId) => [
  {
    userId,
    title: 'First Habit',
    description: 'Created your first habit',
    icon: 'Footprints',
    type: 'milestone',
  },
  {
    userId,
    title: '3-Day Streak',
    description: 'Maintained a 3-day habit streak',
    icon: 'Flame',
    type: 'streak',
  },
  {
    userId,
    title: 'First Completion',
    description: 'Completed your first habit',
    icon: 'CheckCircle',
    type: 'consistency',
  },
];

const seed = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Habit.deleteMany({});
    await Progress.deleteMany({});
    await Achievement.deleteMany({});

    console.log('Seeding users...');
    const users = await User.create(seedUsers);
    console.log(`  Created ${users.length} users`);

    for (const user of users) {
      if (user.role === 'admin') continue;

      console.log(`  Creating habits for ${user.name}...`);
      const habits = await Habit.create(
        seedHabits.map(h => ({ ...h, userId: user._id }))
      );
      console.log(`    Created ${habits.length} habits`);

      const progressData = seedProgress(user._id, habits.map(h => h._id));
      await Progress.insertMany(progressData);
      console.log(`    Created ${progressData.length} progress records`);

      const achievements = seedAchievements(user._id);
      await Achievement.insertMany(achievements);
      console.log(`    Created ${achievements.length} achievements`);
    }

    console.log('\nSeed completed successfully!');
    console.log('Test Accounts:');
    console.log('  John Doe     - john@example.com / password123');
    console.log('  Jane Smith   - jane@example.com / password123');
    console.log('  Admin        - admin@habitai.com / admin123456');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
