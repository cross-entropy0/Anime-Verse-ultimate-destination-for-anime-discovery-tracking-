const mongoose = require('mongoose');
const Anime = require('../models/Anime');
const jikanApi = require('../utils/jikanApi');
require('dotenv').config();

const seedTopAnime = async () => {
  try {
    console.log('🌱 Starting anime database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check if we already have data
    const count = await Anime.countDocuments();
    if (count > 100) {
      console.log(`✅ Database already has ${count} anime. Skipping seed.`);
      process.exit(0);
    }
    
    console.log(`📊 Current anime count: ${count}`);
    console.log('🔄 Fetching top anime from Jikan API...');
    
    // Fetch top 100 anime in batches (25 per page, 4 pages)
    const pages = 4;
    let totalSeeded = 0;
    
    for (let page = 1; page <= pages; page++) {
      console.log(`\n📖 Fetching page ${page}/${pages}...`);
      
      try {
        const result = await jikanApi.getTopAnime(page, 25);
        
        if (result.data && result.data.length > 0) {
          totalSeeded += result.data.length;
          console.log(`  ✅ Cached ${result.data.length} anime (Total: ${totalSeeded})`);
        }
        
        // Wait 2 seconds between pages to respect rate limits
        if (page < pages) {
          console.log('  ⏳ Waiting 2 seconds...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`  ❌ Error on page ${page}:`, error.message);
        // Continue with next page
      }
    }
    
    const finalCount = await Anime.countDocuments();
    console.log(`\n🎉 Seeding complete! Database now has ${finalCount} anime.`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedTopAnime();
