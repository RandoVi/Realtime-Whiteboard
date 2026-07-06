// database.js
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017'; // For local DB

// Database Name
const dbName = 'realtime-whiteboard';

// Create a new MongoClient
const client = new MongoClient(url);

// Function to connect to the database
export async function connectToDatabase() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log('Connected successfully to MongoDB server');

    // Return a reference to the database
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
    // In a production app, you might want to exit the process or handle this more gracefully
    process.exit(1);
  }
}

// Function to close the connection
export async function closeDatabaseConnection() {
  await client.close();
  console.log('Connection to MongoDB closed.');
}