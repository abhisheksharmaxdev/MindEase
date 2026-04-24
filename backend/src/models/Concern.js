const mongoose = require('mongoose');

const concernSchema = new mongoose.Schema(
  {
    reporterUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    friendDetails: {
      firstName: String,
      lastName: String,
      gender: String,
      dateOfBirth: String,
      email: String,
      residencyStatus: String,
      emotionalState: String
    },
    universityDetails: {
      universityName: String,
      studentId: String,
      yearOfStudy: String,
      course: String,
      collegeAddress: String
    },
    guardianDetails: {
      relationToStudent: String,
      contactName: String,
      phoneNumber: String,
      emailAddress: String,
      address: String
    },
    reporterDetails: {
      reporterName: String,
      relationshipToFriend: String,
      contactInformation: String,
      anonymous: { type: Boolean, default: false },
      description: String
    },
    assignedTherapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'accepted', 'rejected'],
      default: 'pending'
    },
    therapistDecisionNote: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Concern', concernSchema);
