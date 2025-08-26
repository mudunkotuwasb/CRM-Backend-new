const mongoose = require('mongoose');

const scheduleContactSchema = new mongoose.Schema({
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'missed'],
    default: 'scheduled'
  },
  outcome: {
    type: String,
    default: ''
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

scheduleContactSchema.index({ contactId: 1, adminId: 1 });
scheduleContactSchema.index({ scheduledDate: 1 });
scheduleContactSchema.index({ status: 1 });

module.exports = mongoose.model('ScheduleContact', scheduleContactSchema);