const dotenv = require('dotenv');
dotenv.config();

const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:4200',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFrom: process.env.SMTP_FROM || 'MindEase <no-reply@mindease.com>',
  openaiApiKey: process.env.OPENAI_API_KEY || ''
};

module.exports = { env };
