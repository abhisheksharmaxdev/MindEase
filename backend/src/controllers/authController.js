const User = require('../models/User');
const { DEFAULT_THERAPISTS } = require('../config/defaultTherapists');
const { comparePassword, hashPassword, signToken } = require('../utils/auth');

/**
 * Converts a database user into the safe client-facing auth payload.
 */
function serializeUser(user) {
  return {
    id: user._id,
    role: user.role,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    therapistProfile: user.therapistProfile
  };
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

/**
 * Creates the normal user account used by students on the booking flow.
 */
async function registerUser(req, res) {
  const { fullName, email, phone, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!fullName || !normalizedEmail || !password) {
    return res.status(400).json({ message: 'Full name, email, and password are required.' });
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const user = await User.create({
    fullName,
    email: normalizedEmail,
    phone,
    passwordHash: await hashPassword(password),
    role: 'user',
    avatarUrl: fullName.slice(0, 2).toUpperCase()
  });

  const token = signToken(user);
  return res.status(201).json({ token, user: serializeUser(user) });
}

/**
 * Handles login for users, therapists, and the optional admin account.
 */
async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: normalizeEmail(email) });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  if (user.role === 'therapist' && user.therapistProfile?.status !== 'approved') {
    return res.status(403).json({
      message: user.therapistProfile?.status === 'rejected'
        ? 'Your therapist application was rejected by the admin.'
        : 'Your therapist profile is pending admin approval.'
    });
  }

  const token = signToken(user);
  return res.json({ token, user: serializeUser(user) });
}

/**
 * Captures therapist signup applications that must be reviewed by the admin
 * before the therapist can access the portal.
 */
async function registerTherapist(req, res) {
  const {
    fullName,
    email,
    phone,
    password,
    qualification,
    experienceText,
    bio,
    languages,
    specializations
  } = req.body;

  const normalizedEmail = normalizeEmail(email);
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const therapist = await User.create({
    fullName,
    email: normalizedEmail,
    phone,
    passwordHash: await hashPassword(password),
    role: 'therapist',
    avatarUrl: fullName.slice(0, 2).toUpperCase(),
    therapistProfile: {
      firstName: fullName.split(' ')[0] || fullName,
      lastName: fullName.split(' ').slice(1).join(' '),
      qualification,
      experienceText,
      bio,
      languages: languages ? JSON.parse(languages) : [],
      specializations: specializations ? JSON.parse(specializations) : [],
      resumeUrl: req.file ? `/uploads/resumes/${req.file.filename}` : '',
      status: 'pending',
      consultationPlans: []
    }
  });

  return res.status(201).json({
    message: 'Therapist signup submitted successfully. Please wait for admin approval.',
    therapist: serializeUser(therapist)
  });
}

/**
 * Returns the current signed-in user for route guards and dashboards.
 */
async function me(req, res) {
  return res.json({ user: serializeUser(req.user) });
}

/**
 * Allows users to update the small editable profile area on the dashboard.
 */
async function updateProfile(req, res) {
  const { fullName, phone } = req.body;

  if (fullName) {
    req.user.fullName = fullName;
  }
  if (phone) {
    req.user.phone = phone;
  }

  await req.user.save();
  return res.json({ user: serializeUser(req.user) });
}

/**
 * Keeps the admin seed for concern assignment workflows, but nothing here sends
 * an email anymore.
 */
async function createAdminSeed() {
  const { env } = require('../config/env');
  await User.findOneAndUpdate(
    { email: normalizeEmail(env.adminEmail) },
    {
      $set: {
        fullName: 'MindEase Admin',
        email: normalizeEmail(env.adminEmail),
        phone: '',
        passwordHash: await hashPassword(env.adminPassword),
        role: 'admin',
        avatarUrl: 'AD',
        isActive: true
      }
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
}

/**
 * Seeds only the three default therapists that the product now supports.
 */
async function createDefaultTherapists() {
  for (const therapist of DEFAULT_THERAPISTS) {
    await User.findOneAndUpdate(
      { email: normalizeEmail(therapist.email) },
      {
        $set: {
          fullName: therapist.fullName,
          email: normalizeEmail(therapist.email),
          phone: therapist.phone,
          passwordHash: await hashPassword(therapist.password),
          role: 'therapist',
          avatarUrl: therapist.avatarUrl,
          isActive: true,
          therapistProfile: therapist.therapistProfile
        }
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }
}

module.exports = {
  registerUser,
  registerTherapist,
  login,
  me,
  updateProfile,
  createAdminSeed,
  createDefaultTherapists
};
