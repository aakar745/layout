import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function fixStallTypes() {
  try {
    console.log('🔍 Fixing stall types...');
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI environment variable is not set');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Check current stallTypes collection name - model is "StallType" which might be different from collection name
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('Collections found:', collectionNames);
    
    // Possible collection names based on mongoose pluralization
    const possibleStallTypeCollections = ['stallTypes', 'stalltypes', 'stall_types', 'stalltypes', 'stalltypemodels'];
    
    for (const collName of possibleStallTypeCollections) {
      if (collectionNames.includes(collName)) {
        console.log(`Found stall type collection: ${collName}`);
        
        // Get existing stall types
        const StallTypeCollection = mongoose.connection.collection(collName);
        const existingTypes = await StallTypeCollection.find({}).toArray();
        console.log(`Found ${existingTypes.length} existing stall types`);
        
        // Log the first one to see its structure
        if (existingTypes.length > 0) {
          console.log('Sample stall type structure:', JSON.stringify(existingTypes[0], null, 2));
        }
        
        // Create properly structured stall types
        const stallTypes = [
          {
            _id: new mongoose.Types.ObjectId(),
            name: 'Standard',
            description: 'Standard booth space',
            status: 'active',
            features: [{ feature: 'Basic amenities' }],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            _id: new mongoose.Types.ObjectId(),
            name: 'Premium',
            description: 'Premium booth with better location',
            status: 'active',
            features: [
              { feature: 'Basic amenities' },
              { feature: 'Prime location' }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            _id: new mongoose.Types.ObjectId(),
            name: 'Platinum',
            description: 'Largest booth with prime location',
            status: 'active',
            features: [
              { feature: 'Basic amenities' },
              { feature: 'Prime location' },
              { feature: 'Extra space' }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        
        // Delete existing and insert new
        await StallTypeCollection.deleteMany({});
        await StallTypeCollection.insertMany(stallTypes);
        console.log(`✅ Created ${stallTypes.length} properly structured stall types`);
      }
    }
    
    // If no existing collection is found, create it in the default location
    if (!possibleStallTypeCollections.some(name => collectionNames.includes(name))) {
      console.log('No stall type collection found, creating new one as "stalltypes"');
      
      const StallTypeCollection = mongoose.connection.collection('stalltypes');
      
      const stallTypes = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Standard',
          description: 'Standard booth space',
          status: 'active',
          features: [{ feature: 'Basic amenities' }],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Premium',
          description: 'Premium booth with better location',
          status: 'active',
          features: [
            { feature: 'Basic amenities' },
            { feature: 'Prime location' }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Platinum',
          description: 'Largest booth with prime location',
          status: 'active',
          features: [
            { feature: 'Basic amenities' },
            { feature: 'Prime location' },
            { feature: 'Extra space' }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await StallTypeCollection.insertMany(stallTypes);
      console.log(`✅ Created ${stallTypes.length} properly structured stall types`);
    }
    
    console.log('\n✅ Stall type fix complete. Please refresh the stall form in the UI.');
  } catch (error) {
    console.error('❌ Error fixing stall types:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
fixStallTypes(); 