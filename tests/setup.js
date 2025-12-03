const mongoose = require('mongoose');

// Ensure connection is available before tests run
// This runs before each test file
beforeAll(async () => {
  // Connect to test database if not already connected
  if (mongoose.connection.readyState === 0) {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/task-manager-test';
    try {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    } catch (error) {
      // Connection might already exist, ignore
      if (mongoose.connection.readyState === 0) {
        throw error;
      }
    }
  }
});

// Cleanup after all tests in a file complete
// Note: This runs after each test file, so we don't disconnect here
// to allow other test files to use the same connection
afterAll(async () => {
  // Just clean up collections, don't disconnect
  // Disconnection will happen in the last test file or via forceExit
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      try {
        await collections[key].deleteMany({});
      } catch (error) {
        // Ignore collection cleanup errors
      }
    }
  } catch (error) {
    // Ignore cleanup errors
  }
});

