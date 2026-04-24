const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { createAppointment, getMyAppointments } = require('../controllers/appointmentController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, requireRole('user'), asyncHandler(createAppointment));
router.get('/mine', requireAuth, requireRole('user'), asyncHandler(getMyAppointments));

module.exports = router;
