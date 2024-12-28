const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  startTime: Date,
  endTime: Date,
  priority: Number,
  status: { type: String, enum: ['pending', 'finished'] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add user reference
});

module.exports = mongoose.model('Task', taskSchema);
