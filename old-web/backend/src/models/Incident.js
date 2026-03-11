const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['MEDICAL', 'SUPPLIES', 'ROAD_BLOCKED', 'EVACUATION', 'RISK_AREA', 'LEVEE_BREACH'],
  },
  status: {
    type: String,
    required: true,
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  reporterName: {
    type: String,
    default: 'พลเมืองดี'
  },
  assignedTo: {
    type: String,
  },
  path: [{
    lat: { type: Number },
    lng: { type: Number }
  }],
  image: { type: String },
  // Additional fields for victim details
  victimCount: {
    type: Number,
    default: 1,
    min: 0
  },
  hasBedridden: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Incident', IncidentSchema);