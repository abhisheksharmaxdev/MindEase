const Review = require('../models/Review');

async function createReview(req, res) {
  const review = await Review.create({
    user: req.user._id,
    rating: req.body.rating,
    title: req.body.title,
    message: req.body.message
  });

  return res.status(201).json({ review });
}

async function getReviews(req, res) {
  const reviews = await Review.find().sort({ createdAt: -1 });
  return res.json({
    reviews: reviews.map((review) => ({
      id: review._id,
      rating: review.rating,
      title: review.title,
      message: review.message,
      createdAt: review.createdAt
    }))
  });
}

module.exports = { createReview, getReviews };
