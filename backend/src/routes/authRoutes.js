const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { asyncHandler } = require('../utils/asyncHandler');
const { login, me, registerTherapist, registerUser, updateProfile } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'resumes');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`)
});
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    const allowedExtensions = ['.pdf', '.doc', '.docx'];

    if (!allowedExtensions.includes(extension)) {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed.'));
      return;
    }

    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.post('/register', asyncHandler(registerUser));
router.post('/register-therapist', upload.single('resume'), asyncHandler(registerTherapist));
router.post('/login', asyncHandler(login));
router.get('/me', requireAuth, asyncHandler(me));
router.patch('/me', requireAuth, asyncHandler(updateProfile));

module.exports = router;
