

import mongoose from 'mongoose';
import Diary from '../models/Diary.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateDiaries = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all diaries that don't have the new fields
        const diaries = await Diary.find({});

        console.log(`Found ${diaries.length} diaries to potentially update`);

        let updatedCount = 0;

        for (const diary of diaries) {
            let needsUpdate = false;

            // Add allowComments if it doesn't exist
            if (diary.allowComments === undefined) {
                diary.allowComments = true;
                needsUpdate = true;
            }

            // Add selectedMood if it doesn't exist
            if (!diary.selectedMood) {
                diary.selectedMood = 'happy';
                needsUpdate = true;
            }

            // Add tags if it doesn't exist
            if (!diary.tags) {
                diary.tags = [];
                needsUpdate = true;
            }

            // Add coverPhoto if it doesn't exist
            if (diary.coverPhoto === undefined) {
                diary.coverPhoto = null;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await diary.save();
                updatedCount++;
            }
        }

        console.log(`Successfully updated ${updatedCount} diaries`);
        console.log('Migration completed!');

    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the migration
migrateDiaries();