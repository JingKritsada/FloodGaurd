const Announcement = require('../models/Announcement');

class AnnouncementService {
  async getAllAnnouncements(page, limit, publishedOnly = true) {
    const skip = (page - 1) * limit;
    const query = publishedOnly ? { isPublished: true } : {};
    return await Announcement.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
  }

  async getAnnouncementById(id) {
    return await Announcement.findById(id);
  }

  async createAnnouncement(data) {
    return await Announcement.create(data);
  }

  async updateAnnouncement(id, data) {
    return await Announcement.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteAnnouncement(id) {
    return await Announcement.findByIdAndDelete(id);
  }

  async publishAnnouncement(id) {
    return await Announcement.findByIdAndUpdate(
      id, 
      { isPublished: true, publishedAt: new Date() }, 
      { new: true }
    );
  }
}

module.exports = new AnnouncementService();
