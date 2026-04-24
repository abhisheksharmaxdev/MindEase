const Concern = require('../models/Concern');

async function createConcern(req, res) {
  const concern = await Concern.create({
    reporterUser: req.user?._id || null,
    friendDetails: req.body.friendDetails,
    universityDetails: req.body.universityDetails,
    guardianDetails: req.body.guardianDetails,
    reporterDetails: req.body.reporterDetails
  });

  return res.status(201).json({ concern });
}

async function getAllConcerns(req, res) {
  const concerns = await Concern.find()
    .populate('assignedTherapist', 'fullName email therapistProfile')
    .sort({ createdAt: -1 });

  return res.json({ concerns });
}

module.exports = { createConcern, getAllConcerns };
