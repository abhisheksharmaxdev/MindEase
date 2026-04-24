const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { createConcern, getAllConcerns } = require('../controllers/concernController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', asyncHandler(createConcern));
router.get('/admin', requireAuth, requireRole('admin'), asyncHandler(getAllConcerns));

module.exports = router;
