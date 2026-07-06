const { connectToDatabase } = require('./../database');

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