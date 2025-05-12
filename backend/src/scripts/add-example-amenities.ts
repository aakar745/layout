/**
 * Script to add example basic amenities to existing exhibitions
 * 
 * This script:
 * 1. Finds all exhibitions
 * 2. Adds some default basic amenities if they don't already have them
 * 
 * Run with: npx ts-node src/scripts/add-example-amenities.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exhibition from '../models/exhibition.model';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/exhibition-management';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err: any) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

// Example basic amenities to add
const exampleBasicAmenities = [
  {
    type: 'equipment' as const,
    name: 'Tables',
    description: 'Standard exhibition tables',
    perSqm: 9,
    quantity: 1
  },
  {
    type: 'equipment' as const,
    name: 'Chairs',
    description: 'Standard exhibition chairs',
    perSqm: 3,
    quantity: 1
  },
  {
    type: 'facility' as const,
    name: 'Spotlights',
    description: 'LED spotlights for stall illumination',
    perSqm: 6,
    quantity: 1
  },
  {
    type: 'equipment' as const,
    name: 'Waste Bins',
    description: 'Small trash bins for waste disposal',
    perSqm: 18,
    quantity: 1
  },
  {
    type: 'service' as const,
    name: 'Basic Cleaning',
    description: 'Daily cleaning of stall area',
    perSqm: 36,
    quantity: 1
  }
];

// Main function to add example amenities
const addExampleAmenities = async () => {
  try {
    // Get all exhibitions
    const exhibitions = await Exhibition.find({});
    
    console.log(`Found ${exhibitions.length} exhibitions to update`);
    
    let updatedCount = 0;
    
    // Process each exhibition
    for (const exhibition of exhibitions) {
      // Skip if already has basic amenities
      if (exhibition.basicAmenities && exhibition.basicAmenities.length > 0) {
        console.log(`Exhibition "${exhibition.name}" already has basic amenities. Skipping.`);
        continue;
      }
      
      console.log(`Adding basic amenities to exhibition: ${exhibition.name}`);
      
      // Add example basic amenities
      exhibition.basicAmenities = exampleBasicAmenities;
      
      // Save the updated exhibition
      await exhibition.save();
      updatedCount++;
      
      console.log(`Successfully added basic amenities to: ${exhibition.name}`);
    }
    
    console.log(`Update completed. Updated ${updatedCount} exhibitions.`);
  } catch (error: any) {
    console.error('Error adding example amenities:', error.message);
  } finally {
    // Disconnect from the database
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
const runScript = async () => {
  try {
    await connectDB();
    await addExampleAmenities();
    console.log('Script completed successfully');
    process.exit(0);
  } catch (error: any) {
    console.error('Script failed:', error.message);
    process.exit(1);
  }
};

// Execute the script
runScript(); 