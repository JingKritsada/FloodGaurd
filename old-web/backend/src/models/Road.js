const mongoose = require('mongoose');

const RoadSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['OPEN', 'CLOSED', 'UNDER_CONSTRUCTION'],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Road', RoadSchema);