const mongoose = require('mongoose');

const consultationPlanSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    sessionCount: { type: Number, required: true },
    price: { type: Number, required: true },
    mode: { type: String, enum: ['Online', 'Offline'], required: true }
  },
  { _id: false }
);

const therapistProfileSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    gender: String,
    pronouns: String,
    qualification: String,
    experienceText: String,
    yearsOfExperience: Number,
    languages: [String],
    specializations: [String],
    bio: String,
    avatarUrl: String,
    resumeUrl: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'not_requested'],
      default: 'not_requested'
    },
    adminNotes: String,
    consultationPlans: [consultationPlanSchema]
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'therapist', 'admin'],
      default: 'user'
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: ''
    },
    passwordHash: {
      type: String,
      required: true
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    therapistProfile: {
      type: therapistProfileSchema,
      default: () => ({ status: 'not_requested', consultationPlans: [] })
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
