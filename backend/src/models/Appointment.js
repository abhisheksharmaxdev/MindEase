const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    transactionId: String,
    amount: Number,
    label: String,
    mode: String,
    paidAt: String,
    status: {
      type: String,
      enum: ['successful', 'failed'],
      default: 'successful'
    }
  },
  { _id: false }
);

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bookingForm: {
      personalInfo: Object,
      therapyInfo: Object,
      safetyInfo: Object,
      preferences: Object
    },
    selectedPlan: {
      label: String,
      sessionCount: Number,
      price: Number,
      mode: String
    },
    paymentStatus: {
      type: String,
      enum: ['successful'],
      default: 'successful'
    },
    status: {
      type: String,
      enum: ['pending_therapist', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'pending_therapist'
    },
    therapistDecision: {
      selectedSlot: String,
      scheduledFor: String,
      notes: String,
      decidedAt: String
    },
    transactionHistory: [transactionSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
