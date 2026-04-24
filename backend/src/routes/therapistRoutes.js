const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const {
  decideAppointment,
  decideConcern,
  getApprovedTherapists,
  getTherapistById,
  getTherapistDashboard
} = require('../controllers/therapistController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', asyncHandler(getApprovedTherapists));
router.get('/dashboard', requireAuth, requireRole('therapist'), asyncHandler(getTherapistDashboard));
router.post('/appointments/:id/decision', requireAuth, requireRole('therapist'), asyncHandler(decideAppointment));
router.post('/concerns/:id/decision', requireAuth, requireRole('therapist'), asyncHandler(decideConcern));
router.get('/:id', asyncHandler(getTherapistById));

module.exports = router;
