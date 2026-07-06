const { connectToDatabase } = require('./../database');

export async function findUsers() {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');

  // Find all users
  const allUsers = await usersCollection.find({}).toArray();
  console.log('All users:', allUsers);

  // Find a user with a specific email
  const user = await usersCollection.findOne({ email: 'alice@example.com' });
  console.log('Found user:', user);

  // Find users older than 25
  const olderUsers = await usersCollection.find({ age: { $gt: 25 } }).toArray();
  console.log('Users older than 25:', olderUsers);
}