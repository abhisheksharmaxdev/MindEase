const User = require('../models/User');
const Concern = require('../models/Concern');
const Appointment = require('../models/Appointment');
const { DEFAULT_THERAPIST_EMAILS } = require('../config/defaultTherapists');

/**
 * Loads only the data that is still useful after removing therapist creation
 * and application-review features from the admin area.
 */
async function getAdminDashboard(req, res) {
  const [concerns, therapists, appointments, therapistApplications] = await Promise.all([
    Concern.find().populate('assignedTherapist', 'fullName').sort({ createdAt: -1 }),
    User.find({
      role: 'therapist',
      email: { $in: DEFAULT_THERAPIST_EMAILS },
      'therapistProfile.status': 'approved'
    }).select('-passwordHash'),
    Appointment.find()
      .populate('therapist', 'fullName')
      .populate('user', 'fullName')
      .sort({ createdAt: -1 }),
    User.find({
      role: 'therapist',
      email: { $nin: DEFAULT_THERAPIST_EMAILS }
    }).select('-passwordHash').sort({ createdAt: -1 })
  ]);

  const therapistIds = therapists.map((item) => item._id);
  const caseCounts = await Appointment.aggregate([
    { $match: { therapist: { $in: therapistIds } } },
    { $group: { _id: '$therapist', activeCases: { $sum: 1 } } }
  ]);

  const caseMap = new Map(caseCounts.map((item) => [String(item._id), item.activeCases]));
  const enrichedTherapists = therapists.map((therapist) => ({
    ...therapist.toObject(),
    activeCases: caseMap.get(String(therapist._id)) || 0
  }));

  return res.json({
    concerns,
    therapists: enrichedTherapists,
    appointments,
    therapistApplications
  });
}

/**
 * Assigns reported concerns to one of the three default therapists.
 */
async function assignConcern(req, res) {
  const { therapistId } = req.body;
  const concern = await Concern.findById(req.params.id);
  const therapist = await User.findOne({
    _id: therapistId,
    role: 'therapist',
    email: { $in: DEFAULT_THERAPIST_EMAILS },
    'therapistProfile.status': 'approved'
  });

  if (!concern || !therapist) {
    return res.status(404).json({ message: 'Concern or therapist not found.' });
  }

  concern.assignedTherapist = therapist._id;
  concern.status = 'assigned';
  await concern.save();

  return res.json({ concern });
}

/**
 * Approves or rejects therapist signup applications from the admin dashboard.
 */
async function reviewTherapist(req, res) {
  const { action, adminNotes } = req.body;
  const therapist = await User.findOne({
    _id: req.params.id,
    role: 'therapist',
    email: { $nin: DEFAULT_THERAPIST_EMAILS }
  });

  if (!therapist) {
    return res.status(404).json({ message: 'Therapist application not found.' });
  }

  therapist.therapistProfile = {
    ...therapist.therapistProfile?.toObject?.(),
    ...therapist.therapistProfile,
    status: action === 'approve' ? 'approved' : 'rejected',
    adminNotes: adminNotes || ''
  };
  await therapist.save();

  return res.json({ therapist });
}

module.exports = {
  getAdminDashboard,
  assignConcern,
  reviewTherapist
};
