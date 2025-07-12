import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      // Connection pool settings for 100+ concurrent users
      maxPoolSize: 150,        // Maximum number of connections in the pool
      minPoolSize: 10,         // Minimum number of connections in the pool
      maxIdleTimeMS: 30000,    // Close connections after 30 seconds of inactivity
      serverSelectionTimeoutMS: 10000,  // Increased timeout for server selection
      socketTimeoutMS: 45000,  // Close sockets after 45 seconds of inactivity
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      retryWrites: true
    });
    console.log('Connected to MongoDB with optimized connection pool for 100+ concurrent users');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB; 