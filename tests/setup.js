const mongoose = require('mongoose');

// Ensure connection is available before tests run
// This runs before each test file
beforeAll(async () => {
  // Connect to test database if not already connected
  if (mongoose.connection.readyState === 0) {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/task-manager-test';
    
    // Retry connection with exponential backoff
    let retries = 5;
    let delay = 1000;
    
    while (retries > 0) {
      try {
        await mongoose.connect(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000
        });
        console.log('MongoDB connected successfully');
        break;
      } catch (error) {
        retries--;
        if (retries === 0) {
          console.error('Failed to connect to MongoDB after retries:', error);
          throw error;
        }
        console.log(`MongoDB connection failed, retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  } else {
    console.log('MongoDB already connected');
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

