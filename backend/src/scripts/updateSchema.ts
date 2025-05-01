import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exhibition-manager');
    console.log('Connected to MongoDB');
    
    // Get the User model
    const User = mongoose.connection.collection('users');
    
    console.log('Updating user schema...');
    
    // Find all users without a name field and update them
    const result = await User.updateMany(
      { name: { $exists: false } },
      { $set: { name: '' } }
    );
    
    console.log('Schema update completed:');
    console.log(`- Modified ${result.modifiedCount} users`);
    console.log(`- Matched ${result.matchedCount} users`);
    
    // Now find a specific user by ID and verify
    if (process.argv[2]) {
      const userId = process.argv[2];
      console.log(`Checking user with ID: ${userId}`);
      
      const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });
      console.log('User found:', user);
    }
    
    console.log('Done. Closing connection...');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the script
connectDB(); 