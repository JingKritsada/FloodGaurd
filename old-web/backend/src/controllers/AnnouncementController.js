const AnnouncementService = require('../services/AnnouncementService');

class AnnouncementController {
  // Public - Get all published announcements
  async getAllAnnouncements(req, res) {
    const { page = 1, limit = 10 } = req.query;
    try {
      const announcements = await AnnouncementService.getAllAnnouncements(parseInt(page), parseInt(limit), true);
      res.status(200).json(announcements);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Public - Get announcement by ID
  async getAnnouncementById(req, res) {
    const { id } = req.params;
    try {
      const announcement = await AnnouncementService.getAnnouncementById(id);
      if (!announcement) {
        return res.status(404).json({ message: 'Announcement not found' });
      }
      res.status(200).json(announcement);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Admin - Get all announcements (including drafts)
  async getAllAnnouncementsAdmin(req, res) {
    const { page = 1, limit = 20 } = req.query;
    try {
      const announcements = await AnnouncementService.getAllAnnouncements(parseInt(page), parseInt(limit), false);
      res.status(200).json(announcements);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Admin - Create announcement
  async createAnnouncement(req, res) {
    try {
      const announcement = await AnnouncementService.createAnnouncement(req.body);
      res.status(201).json(announcement);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Admin - Update announcement
  async updateAnnouncement(req, res) {
    const { id } = req.params;
    try {
      const announcement = await AnnouncementService.updateAnnouncement(id, req.body);
      if (!announcement) {
        return res.status(404).json({ message: 'Announcement not found' });
      }
      res.status(200).json(announcement);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Admin - Delete announcement
  async deleteAnnouncement(req, res) {
    const { id } = req.params;
    try {
      const announcement = await AnnouncementService.deleteAnnouncement(id);
      if (!announcement) {
        return res.status(404).json({ message: 'Announcement not found' });
      }
      res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Admin - Publish announcement
  async publishAnnouncement(req, res) {
    const { id } = req.params;
    try {
      const announcement = await AnnouncementService.publishAnnouncement(id);
      if (!announcement) {
        return res.status(404).json({ message: 'Announcement not found' });
      }
      res.status(200).json(announcement);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AnnouncementController();
