const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/exampleDb', { 'useNewUrlParser': true }, async (err, client) => {
  if (err) {
    console.error(err);
  }

  console.log('Connected to MongoDB instance');
  const db = client.db('marketplace-db');

  try {
    const collections = await db.listCollections().toArray();
    for (let collection of collections) {
      await db.collection(collection.name).drop();
    }
    console.log('Succesfully removed any provisioned data');
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

