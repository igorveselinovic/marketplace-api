const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const path = require('path');

MongoClient.connect('mongodb://localhost:27017/exampleDb', { 'useNewUrlParser': true }, async (err, client) => {
  if (err) {
    console.error(err);
  }

  const dataString = fs.readFileSync(path.join(__dirname, 'provisioningData.json'), 'utf-8');
  const { data } = JSON.parse(dataString);

  console.log('Connected to MongoDB instance');
  const db = client.db('marketplace-db');

  try {
    const collection = await db.collection('inventory');
    await collection.insertMany(data, { w: 1 });
    await client.close();
    console.log('Successfully provisioned data');
  } catch (error) {
    console.error(error);
  }
});
