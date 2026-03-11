const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    default: 'MEDIUM'
  },
  image: {
    type: String,
    default: ''
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String,
    required: true
  },
  publishedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
