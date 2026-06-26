const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: true,
  },
  note: {
    type: String,
    trim: true,
    maxlength: 300,
  },
}, {
  timestamps: true,
});

progressSchema.index({ userId: 1, habitId: 1, date: -1 }, { unique: true });
progressSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Progress', progressSchema);
