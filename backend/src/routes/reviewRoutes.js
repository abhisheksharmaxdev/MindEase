const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { createReview, getReviews } = require('../controllers/reviewController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', asyncHandler(getReviews));
router.post('/', requireAuth, requireRole('user'), asyncHandler(createReview));

module.exports = router;
