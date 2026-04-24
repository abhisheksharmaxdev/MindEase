const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const {
  assignConcern,
  getAdminDashboard,
  reviewTherapist
} = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, requireRole('admin'));
router.get('/dashboard', asyncHandler(getAdminDashboard));
router.post('/concerns/:id/assign', asyncHandler(assignConcern));
router.post('/therapists/:id/review', asyncHandler(reviewTherapist));

module.exports = router;
