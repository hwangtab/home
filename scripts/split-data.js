const fs = require('fs');
const path = require('path');

// Read the original siteData.json
const siteDataPath = path.join(__dirname, '../src/data/siteData.json');
const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));

// Create public/data directory if it doesn't exist
const dataDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Split data for Home page (only featured works)
const homeData = {
  metadata: siteData.metadata,
  artist: {
    name: siteData.artist.name,
    bio: siteData.artist.bio
  },
  works: {
    music: siteData.works.music.filter(item => item.featured)
  }
};

// Split data for Works page (all works)
const worksData = {
  metadata: siteData.metadata,
  works: siteData.works
};

// Split data for About page (artist info + minimal works)
const aboutData = {
  metadata: siteData.metadata,
  artist: siteData.artist,
  works: {
    music: siteData.works.music.filter(item => item.showInPages?.includes('about')),
    visual: siteData.works.visual.filter(item => item.showInPages?.includes('about')),
    writing: siteData.works.writing.filter(item => item.showInPages?.includes('about')),
    performance: siteData.works.performance.filter(item => item.showInPages?.includes('about'))
  }
};

// Split data for Archive page (timeline data)
const archiveData = {
  metadata: siteData.metadata,
  works: {
    music: siteData.works.music.filter(item => item.showInPages?.includes('archive')),
    visual: siteData.works.visual.filter(item => item.showInPages?.includes('archive')),
    writing: siteData.works.writing.filter(item => item.showInPages?.includes('archive')),
    performance: siteData.works.performance.filter(item => item.showInPages?.includes('archive'))
  }
};

// Split data for Contact page (artist contact info only)
const contactData = {
  metadata: siteData.metadata,
  artist: {
    name: siteData.artist.name,
    contact: siteData.artist.contact
  }
};

// Split data for News page
const newsData = {
  metadata: siteData.metadata,
  news: siteData.news,
  events: siteData.events
};

// Write split data files
const filesToWrite = [
  { name: 'home.json', data: homeData },
  { name: 'works.json', data: worksData },
  { name: 'about.json', data: aboutData },
  { name: 'archive.json', data: archiveData },
  { name: 'contact.json', data: contactData },
  { name: 'news.json', data: newsData }
];

filesToWrite.forEach(({ name, data }) => {
  const filePath = path.join(dataDir, name);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  
  const originalSize = JSON.stringify(siteData).length;
  const newSize = JSON.stringify(data).length;
  const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
  
  console.log(`✅ Created ${name} - Size: ${(newSize / 1024).toFixed(1)}KB (${reduction}% reduction)`);
});

console.log('\n📊 Data splitting summary:');
console.log(`Original siteData.json: ${(JSON.stringify(siteData).length / 1024).toFixed(1)}KB`);
console.log(`Home page data: ${(JSON.stringify(homeData).length / 1024).toFixed(1)}KB`);
console.log(`Performance improvement: ${((JSON.stringify(siteData).length - JSON.stringify(homeData).length) / JSON.stringify(siteData).length * 100).toFixed(1)}% less data for home page`);