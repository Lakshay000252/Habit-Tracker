const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  habitName: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true,
    minlength: [2, 'Habit name must be at least 2 characters'],
    maxlength: [100, 'Habit name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: '',
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['study', 'exercise', 'reading', 'meditation', 'water', 'custom'],
    default: 'custom',
  },
  targetFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  reminderTime: {
    type: String,
    default: '08:00',
  },
  color: {
    type: String,
    default: '#6366f1',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

habitSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Habit', habitSchema);
