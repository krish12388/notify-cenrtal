const express = require('express');
const { getUsers, getUserById, updateProfile, changePassword, deleteUser, deleteMyAccount } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getUsers);

router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteMyAccount);
router.put('/change-password', protect, changePassword);

router.route('/:id')
  .get(protect, authorize('admin'), getUserById)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
