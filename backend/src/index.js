const { app } = require('./app');
const fs = require('fs');
const path = require('path');
const { env } = require('./config/env');
const { connectDb } = require('./config/db');
const { createAdminSeed, createDefaultTherapists } = require('./controllers/authController');

function ensureRuntimeDirectories() {
  const uploadRoot = path.join(__dirname, '..', 'uploads');
  const resumeRoot = path.join(uploadRoot, 'resumes');

  fs.mkdirSync(uploadRoot, { recursive: true });
  fs.mkdirSync(resumeRoot, { recursive: true });
}

async function start() {
  ensureRuntimeDirectories();
  await connectDb();
  await createAdminSeed();
  await createDefaultTherapists();
  app.listen(env.port, () => {
    console.log(`MindEase API listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
