const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { requireAuth, requireRole } = require('../middleware/auth');
const { chatWithMindmate } = require('../controllers/mindmateController');

const router = express.Router();

router.post('/chat', requireAuth, requireRole('user'), asyncHandler(chatWithMindmate));

module.exports = router;
