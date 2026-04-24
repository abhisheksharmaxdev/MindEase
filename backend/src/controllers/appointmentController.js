const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { DEFAULT_THERAPIST_BY_SLUG } = require('../config/defaultTherapists');

async function createAppointment(req, res) {
  const slugMatch = DEFAULT_THERAPIST_BY_SLUG.get(req.body.therapistId);
  const therapistLookup = slugMatch
    ? { email: slugMatch.email }
    : { _id: req.body.therapistId };

  const therapist = await User.findOne({
    ...therapistLookup,
    role: 'therapist',
    'therapistProfile.status': 'approved'
  });

  if (!therapist) {
    return res.status(404).json({ message: 'Selected therapist is not available.' });
  }

  const appointment = await Appointment.create({
    user: req.user._id,
    therapist: therapist._id,
    bookingForm: req.body.bookingForm,
    selectedPlan: req.body.selectedPlan,
    transactionHistory: [
      {
        transactionId: `TXN-${Date.now()}`,
        amount: req.body.selectedPlan.price,
        label: req.body.selectedPlan.label,
        mode: req.body.selectedPlan.mode,
        paidAt: new Date().toISOString(),
        status: 'successful'
      }
    ]
  });

  return res.status(201).json({
    message: 'Payment successful and your request has been sent to the selected therapist.',
    appointment
  });
}

async function getMyAppointments(req, res) {
  const appointments = await Appointment.find({ user: req.user._id })
    .populate('therapist', 'fullName email therapistProfile avatarUrl')
    .sort({ createdAt: -1 });

  return res.json({ appointments });
}

module.exports = { createAppointment, getMyAppointments };
