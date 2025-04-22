import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exhibition from '../models/exhibition.model';
import { generateSlug } from '../utils/url';

// Load environment variables
dotenv.config();

// Connect to MongoDB
async function connectToDatabase() {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/exhibition-manager';
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Generate slugs for exhibitions
async function generateSlugs() {
  try {
    // Find all exhibitions without slugs
    const exhibitions = await Exhibition.find({ slug: { $exists: false } });
    
    console.log(`Found ${exhibitions.length} exhibitions without slugs`);
    
    for (const exhibition of exhibitions) {
      // Generate a base slug from the exhibition name
      let baseSlug = generateSlug(exhibition.name);
      let slug = baseSlug;
      let counter = 1;
      
      // Check if slug already exists, if so, append a number
      let slugExists = await Exhibition.findOne({ slug });
      while (slugExists && slugExists._id.toString() !== exhibition._id.toString()) {
        slug = `${baseSlug}-${counter}`;
        counter++;
        slugExists = await Exhibition.findOne({ slug });
      }
      
      // Update the exhibition with the new slug
      exhibition.slug = slug;
      await exhibition.save();
      
      console.log(`Added slug "${slug}" to exhibition "${exhibition.name}" (${exhibition._id})`);
    }
    
    console.log('Slug generation completed successfully');
  } catch (error) {
    console.error('Error generating slugs:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
(async () => {
  await connectToDatabase();
  await generateSlugs();
  process.exit(0);
})(); 