const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let db;

async function connectToDb() {
  if (!db) {
    await client.connect();
    db = client.db('weightTracker');
  }
  return db;
}

module.exports = { connectToDb };
