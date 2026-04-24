const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Concern = require('../models/Concern');
const { DEFAULT_THERAPIST_BY_SLUG, DEFAULT_THERAPIST_EMAILS } = require('../config/defaultTherapists');

/**
 * Returns only the three fixed therapist profiles used by the new matching flow.
 */
async function getApprovedTherapists(req, res) {
  const therapists = await User.find({
    role: 'therapist',
    email: { $in: DEFAULT_THERAPIST_EMAILS },
    'therapistProfile.status': 'approved'
  }).select('-passwordHash');

  return res.json({ therapists });
}

/**
 * Loads an individual therapist profile from the fixed default therapist set.
 */
async function getTherapistById(req, res) {
  const slugMatch = DEFAULT_THERAPIST_BY_SLUG.get(req.params.id);
  const therapistLookup = slugMatch
    ? { email: slugMatch.email }
    : { _id: req.params.id };

  const therapist = await User.findOne({
    ...therapistLookup,
    role: 'therapist',
    email: { $in: DEFAULT_THERAPIST_EMAILS },
    'therapistProfile.status': 'approved'
  }).select('-passwordHash');

  if (!therapist) {
    return res.status(404).json({ message: 'Therapist not found.' });
  }

  return res.json({ therapist });
}

/**
 * Gives each therapist their pending appointment and concern requests.
 */
async function getTherapistDashboard(req, res) {
  const [appointments, concerns] = await Promise.all([
    Appointment.find({ therapist: req.user._id })
      .populate('user', 'fullName email phone')
      .sort({ createdAt: -1 }),
    Concern.find({ assignedTherapist: req.user._id }).sort({ createdAt: -1 })
  ]);

  const stats = {
    pending: appointments.filter((item) => item.status === 'pending_therapist').length + concerns.filter((item) => item.status === 'assigned').length,
    accepted: appointments.filter((item) => item.status === 'approved').length + concerns.filter((item) => item.status === 'accepted').length,
    rejected: appointments.filter((item) => item.status === 'rejected').length + concerns.filter((item) => item.status === 'rejected').length
  };

  return res.json({ stats, appointments, concerns, therapist: req.user });
}

/**
 * Saves the therapist's decision directly on the appointment record.
 */
async function decideAppointment(req, res) {
  const { action, selectedSlot, scheduledFor, notes } = req.body;
  const appointment = await Appointment.findOne({
    _id: req.params.id,
    therapist: req.user._id
  }).populate('user', 'email fullName');

  if (!appointment) {
    return res.status(404).json({ message: 'Appointment request not found.' });
  }

  if (action === 'accept' && !scheduledFor) {
    return res.status(400).json({ message: 'Please choose an available time slot before accepting the appointment.' });
  }

  appointment.status = action === 'accept' ? 'approved' : 'rejected';
  appointment.therapistDecision = {
    selectedSlot: selectedSlot || '',
    scheduledFor: scheduledFor || '',
    notes: notes || '',
    decidedAt: new Date().toISOString()
  };
  await appointment.save();

  return res.json({ appointment });
}

/**
 * Saves therapist decisions for reported concerns assigned by the admin team.
 */
async function decideConcern(req, res) {
  const { action, notes } = req.body;
  const concern = await Concern.findOne({
    _id: req.params.id,
    assignedTherapist: req.user._id
  });

  if (!concern) {
    return res.status(404).json({ message: 'Concern not found.' });
  }

  concern.status = action === 'accept' ? 'accepted' : 'rejected';
  concern.therapistDecisionNote = notes || '';
  await concern.save();

  return res.json({ concern });
}

module.exports = {
  getApprovedTherapists,
  getTherapistById,
  getTherapistDashboard,
  decideAppointment,
  decideConcern
};
