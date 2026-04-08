const express = require('express');
const { getNotifications, markAsRead, markAllAsRead, deleteNotification } = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect); // All routes protected

router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.route('/:id')
  .patch(markAsRead)
  .delete(deleteNotification);

module.exports = router;
