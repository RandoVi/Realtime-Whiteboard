const { connectToDatabase } = require('./../database');

export async function deleteUser() {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');

  // Delete the user with the email 'alice@example.com'
  const query = { email: 'alice@example.com' };
  const result = await usersCollection.deleteOne(query);

  if (result.deletedCount === 1) {
    console.log('Successfully deleted one document.');
  } else {
    console.log('No documents matched the query. Deleted 0 documents.');
  }
}

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

//By ID I assume
export async function findUser() {
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

export async function updateUser() {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');

  // Update Alice's age
  const filter = { email: 'alice@example.com' };
  const updateDocument = {
    $set: { age: 31, updatedAt: new Date() }
  };
  const result = await usersCollection.updateOne(filter, updateDocument);

 console.log(`${result.matchedCount} document(s) matched the filter, ${result.modifiedCount} document(s) was/were modified.`);
}