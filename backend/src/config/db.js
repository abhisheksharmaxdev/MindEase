const mongoose = require('mongoose');
const { env } = require('./env');

async function connectDb() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is missing. Set it to your MongoDB Atlas connection string before starting the server.');
  }

  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000
  });
  console.log(`MongoDB connected: ${env.mongoUri}`);
}

module.exports = { connectDb };
