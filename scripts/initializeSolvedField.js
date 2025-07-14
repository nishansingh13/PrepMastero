const { MongoClient } = require('mongodb');

async function initializeSolvedField() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name'; // Update with your MongoDB URI
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(); // Uses the database from the URI
    const collection = db.collection('microsofts'); // Note: Mongoose pluralizes the collection name

    // Update all documents that don't have a 'solved' field
    const result = await collection.updateMany(
      { solved: { $exists: false } }, // Only update documents that don't have the solved field
      { $set: { solved: false } } // Set solved to false by default
    );

    console.log(`Updated ${result.modifiedCount} documents with solved: false`);

    // Also update any documents where solved is null or undefined
    const result2 = await collection.updateMany(
      { 
        $or: [
          { solved: null },
          { solved: { $exists: true, $eq: undefined } }
        ]
      },
      { $set: { solved: false } }
    );

    console.log(`Updated ${result2.modifiedCount} documents with null/undefined solved field`);

    // Check the current state
    const sampleDocs = await collection.find({}).limit(5).toArray();
    console.log('Sample documents after update:');
    sampleDocs.forEach(doc => {
      console.log(`${doc.Title}: solved = ${doc.solved} (type: ${typeof doc.solved})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

initializeSolvedField();
