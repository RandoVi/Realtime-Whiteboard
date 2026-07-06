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
