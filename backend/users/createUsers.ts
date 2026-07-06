const { connectToDatabase } = require('./../database');

export async function createUser() {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');

  // A sample user document
  const newUser = {
    name: 'Alice Smith',
    email: 'alice@example.com',
    age: 30,
    createdAt: new Date()
  };

  try {
    const result = await usersCollection.insertOne(newUser);
    console.log(`New user created with the following id: ${result.insertedId}`);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    // In a real app, you might not close the connection after every operation.
    // Connection pooling is handled by the driver.
    require('./../database').closeDatabaseConnection();
  }
}