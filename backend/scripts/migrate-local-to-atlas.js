const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const SOURCE_MONGODB_URI = process.env.SOURCE_MONGODB_URI || 'mongodb://127.0.0.1:27017/mindease';
const TARGET_MONGODB_URI = process.env.TARGET_MONGODB_URI || process.env.MONGODB_URI || '';
const BATCH_SIZE = 200;

async function migrateCollection(sourceDb, targetDb, collectionName) {
  const sourceCollection = sourceDb.collection(collectionName);
  const targetCollection = targetDb.collection(collectionName);
  const documents = await sourceCollection.find({}).toArray();

  await targetCollection.deleteMany({});

  for (let index = 0; index < documents.length; index += BATCH_SIZE) {
    const batch = documents.slice(index, index + BATCH_SIZE);
    if (batch.length) {
      await targetCollection.insertMany(batch, { ordered: false });
    }
  }

  console.log(`Migrated ${documents.length} documents from ${collectionName}`);
}

async function migrate() {
  if (!TARGET_MONGODB_URI) {
    throw new Error('TARGET_MONGODB_URI or MONGODB_URI is required for Atlas migration.');
  }

  const source = await mongoose.createConnection(SOURCE_MONGODB_URI).asPromise();
  const target = await mongoose.createConnection(TARGET_MONGODB_URI).asPromise();

  try {
    const collections = await source.db.listCollections({}, { nameOnly: true }).toArray();

    for (const { name } of collections) {
      await migrateCollection(source.db, target.db, name);
    }

    console.log('Local MongoDB data migration to MongoDB Atlas completed successfully.');
  } finally {
    await source.close();
    await target.close();
  }
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
