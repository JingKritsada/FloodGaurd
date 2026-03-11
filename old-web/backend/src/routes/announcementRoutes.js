const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const AnnouncementController = require('../controllers/AnnouncementController');
const { validation } = require('../middlewares/validationMiddleware');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

// Public endpoints
router.get('/', AnnouncementController.getAllAnnouncements);
router.get('/:id', AnnouncementController.getAnnouncementById);

// Admin endpoints (protected)
router.get('/admin/all', authenticateToken, requireRole(['ADMIN']), AnnouncementController.getAllAnnouncementsAdmin);

router.post('/', [
  body('title').isLength({ min: 1 }).withMessage('Title is required'),
  body('content').isLength({ min: 1 }).withMessage('Content is required'),
  body('priority').isIn(['HIGH', 'MEDIUM', 'LOW']).withMessage('Invalid priority'),
  body('createdBy').isLength({ min: 1 }).withMessage('createdBy is required'),
], validation, authenticateToken, requireRole(['ADMIN']), AnnouncementController.createAnnouncement);

router.patch('/:id', authenticateToken, requireRole(['ADMIN']), AnnouncementController.updateAnnouncement);

router.delete('/:id', authenticateToken, requireRole(['ADMIN']), AnnouncementController.deleteAnnouncement);

router.patch('/:id/publish', authenticateToken, requireRole(['ADMIN']), AnnouncementController.publishAnnouncement);

module.exports = router;
