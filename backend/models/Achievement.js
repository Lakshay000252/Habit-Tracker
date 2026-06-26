const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    trim: true,
  },
  icon: {
    type: String,
    default: 'Award',
  },
  type: {
    type: String,
    enum: ['streak', 'milestone', 'consistency', 'special'],
    default: 'milestone',
  },
  unlockedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

achievementSchema.index({ userId: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', achievementSchema);
